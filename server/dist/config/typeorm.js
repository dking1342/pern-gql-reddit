"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const constants_1 = require("../constants");
const path_1 = __importDefault(require("path"));
const Updoot_1 = require("../entities/Updoot");
exports.default = {
    type: constants_1.__db_type__,
    database: constants_1.__db_name__,
    username: constants_1.__db_user__,
    password: constants_1.__db_pw__,
    logging: true,
    synchronize: true,
    migrations: [path_1.default.join(__dirname, "./../migrations/*")],
    entities: [User_1.User, Post_1.Post, Updoot_1.Updoot],
};
//# sourceMappingURL=typeorm.js.map