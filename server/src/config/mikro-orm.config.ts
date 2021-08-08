import { __db_name__, __db_pw__, __db_type__, __db_user__, __prod__ } from "../constants";
import {Post} from "../entities/Post-mikro";
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { User } from "../entities/User-mikro";

// more advanced way of handling type by using Parameters
export default {
    migrations:{
        path: path.join(__dirname,"./migrations"), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files    
    },
    entities:[Post,User],
    dbName:__db_name__,
    user:__db_user__,
    password: __db_pw__,
    debug:!__prod__,
    type:'postgresql',
} as Parameters<typeof MikroORM.init>[0];