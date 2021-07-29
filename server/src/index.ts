import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
// import {Post} from "./entities/Post";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TestResolver } from "./resolvers/test";
import { PostResolver } from "./resolvers/post";

dotenv.config();

const main = async () => {
    try {
        // database init
        const orm = await MikroORM.init(mikroConfig);
        await orm.getMigrator().up();

        // express server init
        const app = express();
        const PORT = process.env.PORT;

        const apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers:[TestResolver,PostResolver],
                validate:false,
            }),
            context:()=>({ em: orm.em })
        });

        await apolloServer.start();
        await apolloServer.applyMiddleware({app});


        app.listen(PORT,()=> console.log('server listening on port 4000'));


        // crud operations //
        // creates the posts on each run
        // const post = orm.em.create(Post,{title:'my second post'})
        // await orm.em.persistAndFlush(post);

        // retreives the posts that are in the db
        // const posts = await orm.em.find(Post,{});
        // console.log(posts);

        
    } catch (error) {
        console.log('---- error ----',error.message);     
    }
}

main();
