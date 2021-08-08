import {Post} from "../entities/Post";
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { TypeormContext } from "src/types";
import { isAuth } from "../utils/auth";
import { User } from "../entities/User";

@InputType()
class PostInput {
    @Field()
    title:string;
    @Field()
    text:string;
}

@ObjectType()
class PostError {
    @Field()
    field:string;
    @Field()
    message:string;
}

@ObjectType()
class PostResponse{
    @Field(()=>[PostError],{nullable:true})
    errors?:PostError[] | [] | null

    @Field(()=>Post,{nullable:true})
    post?:Post | null
}

@Resolver()
export class PostResolver{
    @Query(()=> [Post])
    async posts(): Promise<Post[]>{
        return await Post.find({})
    }

    @Query(()=>Post,{nullable:true})
    postById(
        @Arg('id',()=>Int) id: number,
    ) : Promise<Post | undefined>{
        return Post.findOne(id);
    }

    @Mutation(()=>PostResponse)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req } : TypeormContext
    ): Promise<PostResponse>{
        let { auth, errors } = isAuth(req);

        if(Boolean(errors.length)){
            return {
                errors,
            }
        }

        try {
            const user = await User.findOne({where:{username:auth.username}});
            if(!user){
                return {
                    errors:[
                        {
                            field:"username",
                            message:"no user found"
                        }
                    ]
                }
            }

            const createdPost = await Post.create({
                ...input,
                creatorId:user.id,            
            }).save();

            return{
                post:createdPost
            }
        } catch (error) {
            console.log('create post error',error.message);
            return {
                errors:[
                    {
                        field:"post",
                        message:"post was not created"
                    }
                ]
            };
        }
    }

    @Mutation(()=>Post,{nullable:true})
    async updatePost(
        @Arg("id",()=>Int) id: number,
        @Arg("title",()=>String, { nullable:true}) title: string,
    ): Promise<Post | undefined>{
        const post = await Post.findOne(id);
        if(!post) return undefined;
        if(typeof title !== 'undefined'){
            await Post.update({id},{title});
        }
        return post;
    }

    @Mutation(()=>Boolean)
    async deletePost(
        @Arg("id",()=>Int) id: number,
    ): Promise<boolean>{
        try {
            await Post.delete(id)
            return true;
        } catch (error) {
            return false;
        }
    }
}