import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config';

const main = async () => {
    try {
        const orm = await MikroORM.init(mikroConfig);
        await orm.getMigrator().up();

        // crud operations //
        // creates the posts on each run
        // const post = orm.em.create(Post,{title:'my second post'})
        // await orm.em.persistAndFlush(post);

        // retreives the posts that are in the db
        const posts = await orm.em.find(Post,{});
        console.log(posts);

        
    } catch (error) {
        console.log('---- error ----',error.message)        
    }
}

main();
