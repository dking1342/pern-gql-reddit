import React, { createContext, useReducer } from 'react'
import { UserReducer } from './reducers/UserReducer';

type errorsType = {
    field:string,
    message:string
}

type initialStateType = {
    userInfo:{
        id:string,
        username:string,
        token:string,
    },
    errors:errorsType[],
    registerUser:(data)=>void
}

const initialState:initialStateType = {
    userInfo:{
        id:'',
        username:'',
        token:'',
    },
    errors:[],
    registerUser:(data)=>data
}

export const UserContext = createContext(initialState);

export const UserProvider = ({children}) => {
    const [state, dispatch]=useReducer(UserReducer,initialState);
    let { userInfo, errors,registerUser } = state;

    // actions
    console.log(registerUser())


    return(
        <UserContext.Provider
            value={{
                userInfo,
                errors,
                registerUser
            }}
        >
            {children}
        </UserContext.Provider>
    )


}