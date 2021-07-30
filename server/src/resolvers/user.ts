import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from 'argon2';

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

    @Field(()=>User,{nullable:true})
    user?:User
}

@Resolver()
export class UserResolver{
    @Mutation(()=> UserResponse)
    async register(
        @Arg('options',()=>UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ):Promise<UserResponse>{
        // one way to check if user already exists
        // const checkUser = await em.findOne(User,{username:options.username});
        // if(checkUser){
        //     return{
        //         errors:[
        //             {
        //                 field:"username",
        //                 message:"username already exists"
        //             }
        //         ]
        //     }
        // }

        if(options.username.length <= 2){
            return{
                errors:[
                    {
                        field:"username",
                        message:"username length must be greater than two"
                    }
                ]
            }
        };
        if(options.password.length <= 3){
            return{
                errors:[
                    {
                        field:"password",
                        message:"password length must be greater than three"
                    }
                ]
            }
        }

        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User,{username:options.username, password:hashedPassword});
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
            user
        };
    }

    @Mutation(()=> UserResponse)
    async login(
        @Arg('options',()=>UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ):Promise<UserResponse>{
        const user = await em.findOne(User,{username:options.username});

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

        return {
            user
        };
    }
}