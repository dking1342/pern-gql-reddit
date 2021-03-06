// import { MyContext } from "src/types";
// import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
// import argon2 from 'argon2';
// import { registerValidation } from '../utils/registerValidation';
// import { loginValidation } from "../utils/loginValidation";
// import { generateToken } from '../utils/generateToken';
// import { User } from "../entities/User-mikro";
// import { isAuth } from "../utils/auth";
// import { sendEmail } from "../utils/sendMail";
// import { isPasswordAuth } from "../utils/passwordAuth";

// // alternate way of adding argument
// @InputType()
// class UsernamePasswordInput {
//     @Field()
//     email:string
//     @Field()
//     password:string
// }

// @InputType()
// class RegisterInput {
//     @Field()
//     username:string
//     @Field()
//     email:string
//     @Field()
//     password:string
// }

// @ObjectType()
// class FieldError {
//     @Field()
//     field:string;
//     @Field()
//     message:string;
// }

// @ObjectType()
// class UserResponse{
//     @Field(()=>[FieldError],{nullable:true})
//     errors?:FieldError[]

//     @Field(()=>User,{nullable:true})
//     user?:User | null 
// }

// @ObjectType()
// class UserInfoResponse {
//     @Field(()=>[FieldError],{nullable:true})
//     errors?:FieldError[]

//     @Field(()=>User,{nullable:true})
//     user?:User | null 
// }

// @Resolver()
// export class UserResolver{
//     @Mutation(()=>UserResponse)
//     async changePassword(
//         @Arg('token') token: string,
//         @Arg('newPassword') newPassword:string,
//         @Ctx() { em }:MyContext
//     ):Promise<UserResponse>{
//         if(newPassword.length <= 2){
//             return {
//                 errors :[
//                     {
//                         field:"newPassword",
//                         message:"Password must be at least two characters long"
//                     }
//                 ]
//             }
//         }

//         let { auth, errors } = isPasswordAuth(token);
//         if(errors.length){
//             return{
//                 errors
//             }
//         }
//         try {
//             const user = await em.findOne(User,{username:auth.username});
//             if(!user){
//                 return{
//                     errors:[
//                         {
//                             field:"token",
//                             message:"invalid user"
//                         }
//                     ]
//                 }
//             } 

//             user.password = await argon2.hash(newPassword);
//             await em.persistAndFlush(user);
//             let newToken = generateToken(user);

//             return {
//                 errors:[],
//                 user:{
//                     ...user,
//                     token:newToken
//                 }
//             }
//         } catch (error) {
//             return{
//                 errors:[
//                     {
//                         field:"token",
//                         message:error.message
//                     }
//                 ]
//             }
//         }
//     }

//     @Mutation(()=>Boolean)
//     async forgotPassword(
//         @Arg('email') email:string,
//         @Ctx() {em}:MyContext
//     ){
//         const user = await em.findOne(User,{email})
//         if(!user){
//             // no user with email
//             return true;
//         }

//         const token = generateToken(user);

//         sendEmail(
//             email,
//             `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
//         );
//         return true;
//     }

//     @Query(()=> UserInfoResponse,{nullable:true})
//     async userInfo(
//         @Ctx() { em,req }: MyContext
//     ):Promise<UserInfoResponse>{
//         let { auth, errors } = isAuth(req);
//         if(Boolean(errors.length)){
//             return{
//                 errors
//             }
//         } else {
//             try {
//                 const user = await em.findOne(User,{username:auth.username});
//                 return{
//                     user
//                 }
//             } catch (error) {
//                 return{
//                     errors:[
//                         {
//                             field:"email",
//                             message:"email address does not exists"
//                         },
//                     ]
//                 };                
//             }
//         }
//     }

//     @Mutation(()=> UserResponse)
//     async register(
//         @Arg('options',()=>RegisterInput) options: RegisterInput,
//         @Ctx() {em}: MyContext
//     ):Promise<UserResponse>{
//         let { errorLog, valid } = registerValidation(options);

//         if(!valid){
//             return{
//                 errors:errorLog
//             }
//         }

//         const hashedPassword = await argon2.hash(options.password);
//         let user = em.create(User,{username:options.username, email:options.email, password:hashedPassword});
//         const token = generateToken(user!);

//         try {
//             await em.persistAndFlush(user);  
//         } catch (error) {
//             if(error.code === '23505'){
//                 return{
//                     errors:[
//                         {
//                             field:"username",
//                             message:"username or email already exists"
//                         }
//                     ]
//                 }
//             }
//         }

//         return {
//             user:{...user,token},
//         };

//     }

//     @Mutation(()=> UserResponse)
//     async login(
//         @Arg('options',()=>UsernamePasswordInput) options: UsernamePasswordInput,
//         @Ctx() {em}: MyContext
//     ):Promise<UserResponse>{
//         let { errorLog, valid: validation } = loginValidation(options);
//         if(!validation){
//             return{
//                 errors:errorLog,
//                 user:null
//             }
//         }

//         try {
//             const user = await em.findOne(User,{email:options.email});
//             if(!user){
//                 return{
//                     errors:[
//                         {
//                             field:"email",
//                             message:"email address does not exists"
//                         },
//                     ],
//                 };
//             };

//             const valid = await argon2.verify(user.password,options.password);
//             if(!valid){
//                 return{
//                     errors:[
//                         {
//                             field:"password",
//                             message:"password incorrect"
//                         }
//                     ]
//                 }
//             };
//             const token = generateToken(user!);
//             return {
//                 user:{...user,token}
//             };
//         } catch (error) {
//             return { 
//                 errors:[
//                     {
//                         field:"general",
//                         message:error.message
//                     }
//                 ],
//                 user:null
//             }
//         }
//     }

//     @Mutation(()=>UserResponse)
//     async logout(
//         @Ctx(){em,req}:MyContext
//     ){
//         let { auth, errors } = isAuth(req);

//         if(errors.length){
//             return{
//                 errors,
//                 user:null
//             }
//         }
//         try {
//             const user = await em.findOne(User,{username:auth.username});
//             if(!user){
//                 return{
//                     errors:[
//                         {
//                             field:"username",
//                             message:"username not found"
//                         }
//                     ],
//                     user:null
//                 }
//             } else {
//                 return {
//                     errors:[],
//                     user
//                 }
//             } 
//         } catch (error) {
//             console.log(error.message)
//             return {
//                 errors:[
//                     {
//                         field:"general",
//                         message:error.message
//                     }
//                 ],
//                 user:null
//             }
//         }
//     }


// }