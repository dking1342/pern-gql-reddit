import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { generateToken, validateInput } from "../utils/validation";
import { Users } from "../entities/Users";
import { isAuth } from "../utils/auth";

// alternate way of adding argument
@InputType()
class UsernamePasswordInput {
    @Field()
    username:string
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
class UserResponse{
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[]

    @Field(()=>Users,{nullable:true})
    user?:Users | null 
}

@ObjectType()
class UserInfoResponse{
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[] | []

    @Field(()=>UserInfo,{nullable:true})
    userInfo?:UserInfo | null
}

@ObjectType()
class UserInfo{
    @Field()
    username:string
    @Field()
    iat:number
    @Field()
    exp:number
}

@Resolver()
export class UsersResolver{
    @Query(()=> UserInfoResponse,{nullable:true})
    userInfo(
        @Ctx() { req }: MyContext
    ):UserInfoResponse{
        let { auth, errors } = isAuth(req);
        if(Boolean(errors.length)){
            return{
                errors,
                userInfo:null
            }
        } else {
            return{
                errors:[],
                userInfo:{
                    username:auth.username,
                    iat:auth.iat,
                    exp:auth.exp
                }
            }
        }
    }

    @Mutation(()=> UserResponse)
    async register(
        @Arg('options',()=>UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ):Promise<UserResponse>{
        let { errorLog, valid } = validateInput(options);

        if(!valid){
            return{
                errors:errorLog
            }
        }

        const hashedPassword = await argon2.hash(options.password);
        let user = em.create(Users,{username:options.username, password:hashedPassword});
        const token = generateToken(user!);

        try {
            await em.persistAndFlush(user);  
        } catch (error) {
            if(error.code === '23505'){
                return{
                    errors:[
                        {
                            field:"username",
                            message:"username already exists"
                        }
                    ]
                }
            }
        }

        return {
            user:{...user,token},
        };

    }

    @Mutation(()=> UserResponse)
    async login(
        @Arg('options',()=>UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ):Promise<UserResponse>{
        const user = await em.findOne(Users,{username:options.username});

        if(!user){
            return{
                errors:[
                    {
                        field:"username",
                        message:"username does not exists"
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
                ]
            }
        };
        const token = generateToken(user!);


        return {
            user:{...user,token}
        };
    }



}