import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";


export const useIsAuth = (initialState:string) => {
    
    const { user } = useContext(UserContext);
    const router = useRouter();
    if(initialState === '/login' || initialState === '/register'){
        useEffect(()=>{
            if(Boolean(user)){
                router.replace("/")
            }
        },[user])
    } else if (initialState === '/create-post'){
        useEffect(()=>{
            if(!Boolean(user)){
                router.replace(`/login?next=` + router.pathname);
            } else {
                router.replace(initialState)
            }
        },[user])
    }

    return {
        user
    };
}
