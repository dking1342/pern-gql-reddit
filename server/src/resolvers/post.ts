import {Post} from "../entities/Post";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";


@Resolver()
export class PostResolver{
    @Query(()=> [Post])
    posts(): Promise<Post[]>{
        return Post.find()
    }

    @Query(()=>Post,{nullable:true})
    postById(
        @Arg('id',()=>Int) id: number,
    ) : Promise<Post | undefined>{
        return Post.findOne(id);
    }

    @Mutation(()=>Post)
    async createPost(
        @Arg("title",()=>String) title: string,
    ): Promise<Post>{
        // two sql queries insert then save
        return Post.create({title}).save();
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