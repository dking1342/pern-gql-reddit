"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const constants_1 = require("../constants");
exports.default = {
    type: 'postgres',
    database: constants_1.__db_name__,
    username: constants_1.__db_user__,
    password: constants_1.__db_pw__,
    logging: true,
    synchronize: true,
    entities: [Post_1.Post, User_1.User],
};
//# sourceMappingURL=typeorm.js.map