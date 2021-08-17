import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// many to many relationships
// user <-> posts
// user -> join table <- posts
// user -> updoots <- posts

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
    @Field()
    @Column({type:"int"})
    value:number;

    @Field()
    @PrimaryColumn()
    user_id:number;

    @Field(()=> User)
    @ManyToOne(()=>User,(user)=>user.updoots)
    user:User;

    @Field()
    @PrimaryColumn()
    post_id:number;

    @Field(()=>Post)
    @ManyToOne(()=>Post,(post)=>post.updoots)
    post:Post;
}
