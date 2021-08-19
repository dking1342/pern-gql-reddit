import DataLoader from 'dataloader';
import { Updoot } from '../entities/Updoot';

export const voteLoader = () => new DataLoader<{postId:number,userId:number},Updoot | null>(
    async (keys)=>{
    let votes = await Updoot.findByIds(keys as any);
    const votesIdToUpdoot:Record<string,Updoot> = {};
    votes.forEach(vote=>{
        votesIdToUpdoot[`${Number(vote.user_id)}|${Number(vote.post_id)}`] = vote;
    })
    console.log('keys',keys);
    console.log('votes',votes);
    console.log('votesid',votesIdToUpdoot)
    return keys.map((key) => votesIdToUpdoot[`${key.userId}|${key.postId}`])
})