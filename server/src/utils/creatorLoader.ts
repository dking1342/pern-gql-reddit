import DataLoader from 'dataloader';
import { User } from '../entities/User';

export const creatorLoader = () => new DataLoader<string,User>(async userIds=>{
    let users = await User.findByIds(userIds as string[]);
    const userIdToUser:Record<number,User> = {};
    users.forEach(u=>{
        userIdToUser[Number(u.id)] = u;
    })
    return userIds.map(userId => userIdToUser[Number(userId)])
});