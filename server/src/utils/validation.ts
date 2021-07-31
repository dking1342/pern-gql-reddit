import jwt from 'jsonwebtoken';
import { __TOKEN_SECRET__ } from '../constants';


type UserCredentials = {
    username: string,
    password: string
}

type FieldError = {
    field:string,
    message:string
}

type ValidationResponse = {
    errorLog?:FieldError[] | [],
    valid?:boolean
}

type User = {
    createdAt: Date,
    updatedAt: Date,
    username: string,
    password: string
}

export const validateInput = (options:UserCredentials):ValidationResponse => {
    let errorLog:FieldError[] = [];
    
    if(options.username.length <= 2){
        errorLog = [
            ...errorLog,
            {
                field:"username",
                message:"Username must be at least two characters long"
            }            
        ]
    }

    if(options.password.length <= 2){
        errorLog = [
            ...errorLog,
            {
                field:"password",
                message:"Password must be at least two characters long"
            }
        ]
    }

    return {
        errorLog,
        valid: Object.keys(errorLog).length < 1
    }
}

// export const vaidateLoginInput = () => {

// }

export const generateToken = (user:User) => {
    return jwt.sign(
        {
            username: user.username,
        },
        __TOKEN_SECRET__ as jwt.Secret,
        {expiresIn:'1hr'}
    )
}