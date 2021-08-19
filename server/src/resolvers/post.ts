import {Post} from "../entities/Post";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { TypeormContext } from "src/types";
import { isAuth } from "../utils/auth";
import { User } from "../entities/User";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

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

@ObjectType()
class CreatorType{
    @Field()
    id:number
    @Field()
    username:string
}

@ObjectType()
class JointPost{
    @Field()
    id:number
    @Field()
    createdAt:Date
    @Field()
    updatedAt:Date
    @Field()
    title:string
    @Field()
    text:string
    @Field()
    creator_id:number
    @Field()
    points:number
    @Field(()=>CreatorType)
    creator:CreatorType
}

@Resolver(Post)
export class PostResolver{
    @FieldResolver(()=>String)
    textSnippet(
        @Root() root:Post
    ){
        return root.text.slice(0,50);        
    }

    @Mutation(()=>Boolean)
    async vote(
        @Arg('postId',()=>Int) postId: number,
        @Arg('value',()=>Int) value: number,        
        @Ctx() {req}:TypeormContext
    ){
        let { auth, errors } = isAuth(req);
        
        if(Boolean(errors.length)){
            errors.forEach(err=>{
                throw new Error(err.message)
            })
            return false;
        }
        const { id } = auth;
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1; 
        let err='';
        const updoot = await Updoot.findOne({where:{post_id:postId,user_id:id}})

        if(updoot && updoot.value !== realValue){
            try {
                await getConnection().transaction(async tm => {
                    await tm.query(`
                        UPDATE updoot
                        SET value = $1
                        WHERE post_id = $2 AND user_id = $3
                    `,[realValue,postId,id]);
                    await tm.query(`
                        UPDATE post
                        SET points = points + $1
                        WHERE id = $2;                    
                    `,[2 * realValue,postId]);
                })
            } catch (error) {
                console.log('vote error change',error.message)
                err = error.message;
            }
        } else if(!updoot){
            try {
                await getConnection().transaction(async tm => {
                    await tm.query(`
                        INSERT INTO updoot(
                            user_id,
                            post_id,
                            value
                        )
                        VALUES (
                            $1,
                            $2,
                            $3
                        );
                    `,[id,postId,realValue]);
                    await tm.query(`
                        UPDATE post
                        SET points = points + $1
                        WHERE id = $2;
                    `,[realValue,postId]);
                })
            } catch (error) {
                console.log('vote error 2',error.message);
                err = error.message;
            }
        } 

        return Boolean(err) ? false : true;
    }

    @Query(()=> PaginatedPost)
    async posts(
        @Arg('limit',()=>Int) limit:number,
        // @Arg('offset') offset:number,
        @Arg('cursor',()=>String,{nullable:true}) cursor:string | null,
        // @Info() info:any,
        @Ctx() {req}:TypeormContext,
    ): Promise<PaginatedPost>{
        let { auth } = isAuth(req);

        const realLimit = Math.min(50,limit) + 1;
        const realLimitPlusOne = realLimit + 1;
        const replacements:any[] = [realLimitPlusOne,]
        if(auth.id){
            replacements.push(auth.id)
        } 
        let cursorIndex = 3;
        if(cursor){
            replacements.push(new Date(parseInt(cursor)));
            cursorIndex = replacements.length;
        }

        let posts:any[] = [];
        try {
            posts = await getConnection().query(`
                SELECT 
                    post.*,
                    json_build_object(
                        'id',public.user.id,
                        'username',public.user.username,
                        'email',public.user.email
                    ) creator
                ${auth.id ? ',(SELECT value FROM updoot WHERE user_id = $2 AND post_id = post.id) vote_status' : ', NULL AS vote_status'}
                FROM post
                INNER JOIN public.user ON public.user.id = post.creator_id
                ${cursor ? `WHERE post."createdAt" < $${cursorIndex}` : ''}
                ORDER BY post."createdAt" DESC
                LIMIT $1
            `,replacements);
        } catch (error) {
            console.log('posts error',error.message)
        }

        return {
            hasMore:posts.length === realLimitPlusOne,
            posts:posts.slice(0,realLimit), 
        };
    }

    @Query(()=>JointPost)
    async post(
        @Arg('id',()=>Int) id: number,
    ) : Promise<JointPost | undefined>{
        let post:any;
        try {
            post = await getConnection().query(`
                SELECT 
                    post.*,
                    json_build_object(
                        'id',public.user.id,
                        'username',public.user.username,
                        'email',public.user.email
                    ) creator
                FROM post
                INNER JOIN public.user ON public.user.id = post.creator_id
                WHERE post.id = ${id}
                LIMIT 1
            `);
        } catch (error) {
            console.log('postbyid error',error.message);
            return undefined;
        }
        return post[0] as JointPost;
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
        @Arg("title") title: string,
        @Arg("text") text: string,
    ): Promise<Post | null>{
        let updatedPost:Post[];

        try {
            updatedPost = await getConnection().query(`
                UPDATE post
                SET title = $1,text = $2
                WHERE id = $3
                RETURNING *;
            `,[title,text,id]);
        } catch (error) {
            console.log('update post error',error.message);
            return null;
        }
        if(Boolean(updatedPost.length)){
            try {
                let post = await Post.findOne({id});
                return post ? post : null;                
            } catch (error) {
                console.log('update find error',error.message)
                return null;
            }
        } else {
            return null;
        }
    }

    @Mutation(()=>Boolean)
    async deletePost(
        @Arg("id",()=>Int) id: number,
        @Ctx() { req }: TypeormContext
    ): Promise<boolean>{
        let { auth, errors } = isAuth(req);
        if(Boolean(errors.length)){
            return false;
        }

        try {
            await Updoot.delete({post_id:id});
            await Post.delete({id,creator_id:auth.id});
            return true;
        } catch (error) {
            return false;
        }
    }
}