import jwt from 'jsonwebtoken';
import { __TOKEN_SECRET__ } from "../constants";

type AuthError = {
    field:string
    message: string
}

type AuthResponse = {
    auth:any,
    errors:AuthError[] | []
}

export const isPasswordAuth = (token:string):AuthResponse => {
    let errors:AuthError[] | [] = [];

    try {
        const user = jwt.verify(token,__TOKEN_SECRET__ as any);
        return{
            auth:user,
            errors,
        }
    } catch (error) {
        return{
            auth:null,
            errors:[
                {
                    field:"token",
                    message:"Invalid token"
                }
            ]
        }
    }
};