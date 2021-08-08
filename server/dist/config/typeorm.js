"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const constants_1 = require("../constants");
exports.default = {
    type: constants_1.__db_type__,
    database: constants_1.__db_name__,
    username: constants_1.__db_user__,
    password: constants_1.__db_pw__,
    logging: true,
    synchronize: true,
    entities: [User_1.User, Post_1.Post],
};
//# sourceMappingURL=typeorm.js.map