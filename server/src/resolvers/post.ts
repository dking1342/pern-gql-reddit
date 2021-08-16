import {Post} from "../entities/Post";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { TypeormContext } from "src/types";
import { isAuth } from "../utils/auth";
import { User } from "../entities/User";
import { getConnection } from "typeorm";

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

@ObjectType()
class PaginatedPost{
    @Field(()=>[Post])
    posts:Post[]
    @Field()
    hasMore:boolean
}

@Resolver(Post)
export class PostResolver{
    @FieldResolver(()=>String)
    textSnippet(
        @Root() root:Post
    ){
        return root.text.slice(0,50);        
    }
    @Query(()=> PaginatedPost)
    async posts(
        @Arg('limit',()=>Int) limit:number,
        // @Arg('offset') offset:number,
        @Arg('cursor',()=>String,{nullable:true}) cursor:string | null,
        // @Info() info:any,
    ): Promise<PaginatedPost>{
        const realLimit = Math.min(50,limit) + 1;
        const realLimitPlusOne = realLimit + 1;

        const replacements:any[] = [realLimitPlusOne,]

        if(cursor){
            replacements.push(new Date(Number(cursor)));
        }
        //re
        const posts = await getConnection().query(`
            SELECT 
            post.*, 
            json_build_object(
                'id',public.user.id,
                'username',public.user.username,
                'email',public.user.email
                ) creator
            FROM post
            ${cursor ? `WHERE post."createdAt" < $2` : ''}
            INNER JOIN public.user ON public.user.id = post.creator_id
            ORDER BY post."createdAt" DESC
            LIMIT $1
        `,replacements);



        // const qb = getConnection()
            // .getRepository(Post)
            // .createQueryBuilder("posts")
            // .innerJoinAndSelect("posts.creator","user",'user.id = posts."creator_id"')
            // .orderBy('posts."createdAt"','DESC')
            // .take(realLimitPlusOne);
        // if(cursor){
        //     qb.where('posts."createdAt" < :cursor',{ cursor: new Date(Number(cursor)) })
        // }
        // const posts = await qb.getMany();

        return {
            hasMore:posts.length === realLimitPlusOne,
            posts:posts.slice(0,realLimit), 
        };
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
        } else {
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
                    creator_id:user.id,            
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