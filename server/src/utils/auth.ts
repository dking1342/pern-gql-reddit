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


export const isAuth = (context:any):AuthResponse => {
    let errors:AuthError[] | [] = [];
    const authorization = context.req.headers.authorization;

    if(authorization){
        const token = authorization.split('Bearer ')[1];
        if(token){
            try {
                const user = jwt.verify(token,__TOKEN_SECRET__ as jwt.Secret);
                return {
                    auth: user,
                    errors
                }
            } catch (error) {
                return{
                    auth:'',
                    errors:[
                        {   
                            field:"token",
                            message: "Invalid/Expired token"
                        }
                    ]
                }
            }
        } else {
            return{
                auth:'',
                errors: [
                    {
                        field:"token",
                        message:"Authentication token must be formatted properly"
                    }
                ]
            }
        }

    } else {
        return{
            auth:'',
            errors: [
                {
                    field:"token",
                    message:"Correct header must be given"
                }
            ]
        }
    }
}