import { TypeormContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { registerValidation } from '../utils/registerValidation';
import { loginValidation } from "../utils/loginValidation";
import { generateToken } from '../utils/generateToken';
import { User } from "../entities/User";
import { isAuth } from "../utils/auth";
import { sendEmail } from "../utils/sendMail";
import { isPasswordAuth } from "../utils/passwordAuth";
import { getConnection } from "typeorm";

// alternate way of adding argument
@InputType()
class UsernamePasswordInput {
    @Field()
    email:string
    @Field()
    password:string
}

@InputType()
class RegisterInput {
    @Field()
    username:string
    @Field()
    email:string
    @Field()
    password:string
}

@ObjectType()
class FieldError {
    @Field()
    field:string;
    @Field()
    message:string;
}

@ObjectType()
class UserType {
    @Field()
    id:number;
    @Field()
    createdAt:Date;
    @Field()
    updatedAt:Date;
    @Field()
    username:string;
    @Field()
    email:string;
    @Field()
    token:string;
}

@ObjectType()
class UserResponse{
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[] | [] | null

    @Field(()=>User,{nullable:true})
    user?:UserType | undefined | null
}

@ObjectType()
class UserInfoResponse {
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[]

    @Field(()=>User,{nullable:true})
    user?:User | undefined | null
}

@Resolver()
export class UserResolver{
    @Mutation(()=>UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword:string,
    ):Promise<UserResponse>{
        if(newPassword.length <= 2){
            return {
                errors :[
                    {
                        field:"newPassword",
                        message:"Password must be at least two characters long"
                    }
                ]
            }
        }

        let { auth, errors } = isPasswordAuth(token);
        if(errors.length){
            return{
                errors,
            }
        }
        try {
            const user = await User.findOne({where:{username:auth.username}});
            if(!user){
                return{
                    errors:[
                        {
                            field:"token",
                            message:"invalid user"
                        }
                    ],
                }
            } 
            const userId = user.id;
            newPassword = await argon2.hash(newPassword);
            await User.update({id:userId},{password:newPassword});
            let newToken = generateToken(user);

            return {
                user:{
                    ...user,
                    token:newToken
                }
            }
        } catch (error) {
            return{
                errors:[
                    {
                        field:"token",
                        message:error.message
                    }
                ],
            }
        }
    }

    @Mutation(()=>Boolean)
    async forgotPassword(
        @Arg('email') email:string,
    ):Promise<boolean>{
        const user = await User.findOne({where:{email}})
        if(!user){
            // no user with email
            return true;
        }

        const token = generateToken(user);

        sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );
        return true;
    }

    @Query(()=> UserInfoResponse,{nullable:true})
    async userInfo(
        @Ctx() { req }: TypeormContext
    ):Promise<UserInfoResponse>{
        let { auth, errors } = isAuth(req);
        if(Boolean(errors.length)){
            return{
                errors,
            }
        } else {
            try {
                const user = await User.findOne({where:{username:auth.username}});
                return{
                    user
                }
            } catch (error) {
                return{
                    errors:[
                        {
                            field:"email",
                            message:"email address does not exists"
                        },
                    ],
                };                
            }
        }
    }

    @Mutation(()=> UserResponse)
    async register(
        @Arg('options',()=>RegisterInput) options: RegisterInput,
    ):Promise<UserResponse>{

        let { errorLog, valid } = registerValidation(options);
        
        if(!valid){
            return{
                errors:errorLog,
            }
        }
        
        const hashedPassword = await argon2.hash(options.password);
        try {
            const result = 
                await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username:options.username, 
                    email:options.email, 
                    password:hashedPassword
                })
                .returning('*')
                .execute();
            let token = generateToken(result.raw[0]);
            return {
                user:{
                    ...result.raw[0],
                    token
                }
            }

        } catch (error) {
            if(error.code === '23505'){
                return{
                    errors:[
                        {
                            field:"username",
                            message:"username or email already exists"
                        }
                    ],
                }
            } else {
                return {
                    errors:[
                        {
                            field:"username",
                            message:error.message
                        }
                    ],
                }
            }
        }
    }

    @Mutation(()=> UserResponse)
    async login(
        @Arg('options',()=>UsernamePasswordInput) options: UsernamePasswordInput,
    ):Promise<UserResponse>{
        let { errorLog, valid: validation } = loginValidation(options);
        if(!validation){
            return{
                errors:errorLog,
            }
        }

        try {
            const user = await User.findOne({where:{email:options.email}});
            if(!user){
                return{
                    errors:[
                        {
                            field:"email",
                            message:"email address does not exists"
                        },
                    ],
                };
            };

            const valid = await argon2.verify(user.password,options.password);
            if(!valid){
                return{
                    errors:[
                        {
                            field:"password",
                            message:"password incorrect"
                        }
                    ],
                }
            };
            const token = generateToken(user!);
            return {
                user:{...user,token}
            };
        } catch (error) {
            return { 
                errors:[
                    {
                        field:"general",
                        message:error.message
                    }
                ],
            }
        }
    }

    @Mutation(()=>UserResponse)
    async logout(
        @Ctx(){req}:TypeormContext
    ){
        let { auth, errors } = isAuth(req);

        if(errors.length){
            return{
                errors,
            }
        }
        try {
            const user = await User.findOne({where:{username:auth.username}});
            if(!user){
                return{
                    errors:[
                        {
                            field:"username",
                            message:"username not found"
                        }
                    ],
                }
            } else {
                return {
                    user
                }
            } 
        } catch (error) {
            console.log(error.message)
            return {
                errors:[
                    {
                        field:"general",
                        message:error.message
                    }
                ],
            }
        }
    }


}