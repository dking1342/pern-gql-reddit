"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatorLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const User_1 = require("../entities/User");
const creatorLoader = () => new dataloader_1.default(async (userIds) => {
    let users = await User_1.User.findByIds(userIds);
    const userIdToUser = {};
    users.forEach(u => {
        userIdToUser[Number(u.id)] = u;
    });
    return userIds.map(userId => userIdToUser[Number(userId)]);
});
exports.creatorLoader = creatorLoader;
//# sourceMappingURL=creatorLoader.js.map