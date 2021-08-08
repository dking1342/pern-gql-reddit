import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { __db_name__, __db_pw__, __db_type__, __db_user__, __prod__ } from "../constants";

export default {
    type:__db_type__,
    database:__db_name__,
    username:__db_user__,
    password:__db_pw__,
    logging:true,
    synchronize:true,
    entities:[User,Post],
} as any