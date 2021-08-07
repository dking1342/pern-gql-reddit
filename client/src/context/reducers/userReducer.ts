import { USER_CHANGE_PW, USER_ERROR, USER_LOGIN, USER_LOGOUT, USER_REGISTER } from "../constants";
import { initialStateType } from "../userContext";

export const userReducer = (state:initialStateType,action:any) => {
    switch (action.type) {
        case USER_LOGIN:
            return{
                ...state,
                user:{
                    id:action.payload.data.login.user.id,
                    username:action.payload.data.login.user.username,
                    email:action.payload.data.login.user.email,
                    token:action.payload.data.login.user.token
                }
            }
        case USER_REGISTER:
            return{
                ...state,
                user:{
                    id:action.payload.data.register.user.id,
                    username:action.payload.data.register.user.username,
                    email:action.payload.data.register.user.email,
                    token:action.payload.data.register.user.token
                }
            }
        case USER_ERROR:
            return{
                ...state,
                errors:action.payload,
                user:null
            }
        case USER_LOGOUT:
            return{
                ...state,
                errors:[],
                user:null
            }
        case USER_CHANGE_PW:
            return{
                ...state,
                errors:[],
                user:{
                    id:action.payload.id,
                    username:action.payload.username,
                    email:action.payload.email,
                    token:action.payload.token
                }
            }
            
    
        default:
            return state;
    }
}