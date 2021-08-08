import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Post } from "./Post";


@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!:number;

    @Field()
    @Column({unique:true})
    username!:string;

    @Column()
    password!:string;

    @OneToMany(()=>Post,post=>post.creator)
    posts:Post[];

    @Field()
    @Column({unique:true})
    email!:string;

    @Field()
    @Column({nullable:true})
    token:string

    @Field(()=>String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(()=>String)
    @UpdateDateColumn()
    updatedAt: Date;

}