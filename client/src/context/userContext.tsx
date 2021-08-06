import React, { createContext, useReducer } from 'react';
import { USER_ERROR, USER_LOGIN, USER_LOGOUT, USER_REGISTER } from './constants';
import { userReducer } from './reducers/userReducer';

type errorsType = {
    field:string,
    message:string
}

type userType = {
    id:number,
    username:string,
    email:string,
    token?:string
}

type fnType = (payload:any) => void;

export type initialStateType = {
    errors:errorsType[] | [],
    user: userType | null,
    loginFn:fnType,
    registerFn:fnType,
    logoutFn:fnType,
}

const initialState:initialStateType = {
    errors:[],
    user:null,
    loginFn:()=>{},
    registerFn:()=>{},
    logoutFn:()=>{},
}

export const UserContext = createContext(initialState);

export const UserProvider = (props:any) => {
    const [state,dispatch] = useReducer(userReducer,initialState);
    let { errors, user } = state;
    

    // actions
    const loginFn:fnType = (payload) => {
        if(Boolean(payload.data.login.errors)){
            dispatch({
                type:USER_ERROR,
                payload:payload.data.login.errors
            })
        } else {
            let userInfo = localStorage.getItem('userInfo');
    
            if(userInfo){
                localStorage.removeItem('userInfo')
                localStorage.setItem('userInfo',JSON.stringify(payload.data.login.user));
            } else {
                localStorage.setItem('userInfo',JSON.stringify(payload.data.login.user));
            }
            dispatch({
                type:USER_LOGIN,
                payload
            })
        }
    }

    const registerFn:fnType = (payload) => {
        if(Boolean(payload.data.register.errors)){
            dispatch({
                type:USER_ERROR,
                payload:payload.data.register.errors
            })
        } else {
            let userInfo = localStorage.getItem('userInfo');
            if(userInfo){
                localStorage.removeItem('userInfo')
                localStorage.setItem('userInfo',JSON.stringify(payload.data.register.user));
            } else {
                localStorage.setItem('userInfo',JSON.stringify(payload.data.register.user));
            }
            dispatch({
                type:USER_REGISTER,
                payload
            })
        }
    }

    const logoutFn:fnType = (payload) => {
        if(Boolean(payload.data.logout.errors)){
            dispatch({
                type:USER_ERROR,
                payload:payload.data.logout.errors
            })
        } else {
            localStorage.removeItem('userInfo');
            dispatch({
                type:USER_LOGOUT,
                payload:payload.data.logout.user
            })
        }

    }


    return(
        <UserContext.Provider
            value={{
                errors,
                user,
                loginFn,
                registerFn,
                logoutFn
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}