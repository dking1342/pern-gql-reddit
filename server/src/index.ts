import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from './mikro-orm.config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/users';
import cors from 'cors';

dotenv.config();

const main = async () => {
    try {
        // database init
        const orm = await MikroORM.init(mikroConfig);
        await orm.getMigrator().up();

        // express server init
        const app = express();
        const PORT = process.env.PORT;
        app.use(cors());

        // apollo server config
        const apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers:[PostResolver,UserResolver],
                validate:false,
                
            }),
            context:(req)=>({ em: orm.em,req:req})
        });

        // apollo server init
        await apolloServer.start();
        await apolloServer.applyMiddleware({app});

        // express app listen
        app.listen(PORT,()=> console.log('server listening on port 4000'));
    } catch (error) {
        console.log('---- error ----',error.message);     
    }
}

main();
