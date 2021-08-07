import { authExchange } from "@urql/exchange-auth";
import { dedupExchange, makeOperation, fetchExchange } from "urql";
import { LoginMutation, UserInfoQuery, UserInfoDocument, RegisterMutation, LogoutMutation, ChangePasswordMutation } from "../generated/graphql";
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache'

// helper function
function betterUpdateQuery<Result,Query>(
    cache:Cache,
    qi:QueryInput,
    result:any,
    fn:(r:Result,q:Query)=> Query
  ){
  return cache.updateQuery(qi,data=>fn(result,data as any) as any);
};

export const createUrqlClient = (ssrExchange:any) => ({
    url:'http://localhost:4000/graphql',
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates:{
          Mutation:{
            login:(_result,_,cache,__) => {
              betterUpdateQuery<LoginMutation,UserInfoQuery>(
                cache,
                {query:UserInfoDocument},
                _result,
                (result:any,query)=>{
                  if(result.login.errors){
                    return query;
                  } else {
                    return {
                      userInfo:result.login.user
                    }
                  }
                }
              );
            },
            register:(_result,_,cache,__) => {
              betterUpdateQuery<RegisterMutation,UserInfoQuery>(
                cache,
                {query:UserInfoDocument},
                _result,
                (result:any,query)=>{
                  if(result.register.errors){
                    return query
                  } else {
                    return{
                      userInfo:result.register.user
                    }
                  }
                }
              );
            },
            logout:(_result,_,cache,__) => {
              betterUpdateQuery<LogoutMutation,UserInfoQuery>(
                cache,
                {query:UserInfoDocument},
                _result,
                ()=> {
                  let { user } = _result.logout as any;
                  cache.invalidate({
                    __typename:"UserResponse",
                    id:user.id
                  });
                  cache.invalidate({
                    __typename:"UserInfoResponse",
                    id:user.id
                  });
                  return {userInfo:null};
                }
              );
            },
            changePassword:(_result,_,cache,__)=>{
              betterUpdateQuery<ChangePasswordMutation,UserInfoQuery>(
                cache,
                {query:UserInfoDocument},
                _result,
                (result:any,query)=>{
                  if(result.changePassword.errors){
                    return query
                  } else {
                    return{
                      userInfo:result.changePassword.user
                    }
                  }
                }
              )
            },
          }
        },

      }),
      ssrExchange,
      authExchange({
        addAuthToOperation: ({
          authState,
          operation,
        }) => {
          // the token isn't in the auth state, return the operation without changes
          if (!authState) {
            return operation;
          }
          let { token }: any = authState;
  
          // fetchOptions can be a function (See Client API) but you can simplify this based on usage
          const fetchOptions =
            typeof operation.context.fetchOptions === 'function'
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions || {};
  
          return makeOperation(
            operation.kind,
            operation,
            {
              ...operation.context,
              fetchOptions: {
                ...fetchOptions,
                headers: {
                  ...fetchOptions.headers,
                  "Authorization": `Bearer ${token}`,
                },
              },
            },
          );
        },
        willAuthError: ({ authState }) => {
          if (!authState) return true;
          // e.g. check for expiration, existence of auth etc
          return false;
        },
        didAuthError: ({ error }) => {
          // check if the error was an auth error (this can be implemented in various ways, e.g. 401 or a special error code)
          return error.graphQLErrors.some(
            e => e.extensions?.code === 'FORBIDDEN',
          );
        },
        getAuth: async({ authState }) => {
            // for initial launch, fetch the auth state from storage (local storage, async storage etc)
            try {
              if (!authState && typeof window !== 'undefined') {
                const isUser = Boolean(window.localStorage.getItem('userInfo'));
                if(isUser){
                  const {token} = JSON.parse(window.localStorage.getItem('userInfo')!);
                  return { token };
                }
                return null;
              } 
              return null;
              
            } catch (error) {
              console.log('auth error',error.message);
              return error.message;           
            }
        },
  
      }),
      fetchExchange,
    ],       

})


