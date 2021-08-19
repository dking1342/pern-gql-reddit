"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const Updoot_1 = require("../entities/Updoot");
const voteLoader = () => new dataloader_1.default(async (keys) => {
    let votes = await Updoot_1.Updoot.findByIds(keys);
    const votesIdToUpdoot = {};
    votes.forEach(vote => {
        votesIdToUpdoot[`${Number(vote.user_id)}|${Number(vote.post_id)}`] = vote;
    });
    console.log('keys', keys);
    console.log('votes', votes);
    console.log('votesid', votesIdToUpdoot);
    return keys.map((key) => votesIdToUpdoot[`${key.userId}|${key.postId}`]);
});
exports.voteLoader = voteLoader;
//# sourceMappingURL=voteLoader.js.map