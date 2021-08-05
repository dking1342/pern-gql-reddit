import jwt from 'jsonwebtoken';
import { __TOKEN_SECRET__ } from '../constants';

type User = {
    id:number,
    createdAt: Date,
    updatedAt: Date,
    username: string,
    email:string,
    password: string
}

export const generateToken = (user:User) => {
    return jwt.sign(
        {
            id: user.id,
            email:user.email,
            username: user.username,
        },
        __TOKEN_SECRET__ as jwt.Secret,
        {expiresIn:'1hr'}
    )
}