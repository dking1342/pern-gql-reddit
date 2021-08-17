import { authExchange } from "@urql/exchange-auth";
import { Cache, cacheExchange, QueryInput, Resolver } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange, makeOperation } from "urql";
import { ChangePasswordMutation, LoginMutation, LogoutMutation, RegisterMutation, UserInfoDocument, UserInfoQuery } from "../generated/graphql";

// helper function
function betterUpdateQuery<Result,Query>(
    cache:Cache,
    qi:QueryInput,
    result:any,
    fn:(r:Result,q:Query)=> Query
  ){
  return cache.updateQuery(qi,data=>fn(result,data as any) as any);
};

// helper function
const cursorPagination = ():Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const isInCache = cache.resolve(
      entityKey,
      "posts",
      fieldArgs
    );
    info.partial = !isInCache;  
    let hasMore = true;    
    const results = fieldInfos
      .reduce((acc:any[],val)=>{
        const key = cache.resolve(entityKey,val.fieldKey) as string;
        const data = cache.resolve(key,'posts') as string[];
        const _hasMore = cache.resolve(key,'hasMore');
        if(!_hasMore){
          hasMore = _hasMore as boolean;
        }
        return [...acc,data];
      },[])
      .flat(Infinity);
    return {
      __typename:"PaginatedPost",
      hasMore,
      posts:results,
    };

  };
};

export const createUrqlClient = (ssrExchange:any) => ({
    url:'http://localhost:4000/graphql',
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys:{
          PaginatedPost: ()=>null,
        },
        resolvers:{
          Query:{
            posts:cursorPagination(),
          },
        },
        updates:{
          Mutation:{
            createPost:(_result,_,cache,__)=>{
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter((info)=> info.fieldName === 'posts');
              fieldInfos.forEach((fieldInfo)=>{
                  console.log('fi',fieldInfo)
                })
                cache.invalidate(
                  "Query",
                  "posts",{
                    limit:15
                  }
              );                
            },
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
                  let { errors } = _result.logout as any;
                  if(Boolean(errors)){
                    return{userInfo:null};
                  } else {
                    cache.invalidate(
                      "Query",
                      "users",{
                        userInfo:null
                      }
                    );
                    return {userInfo:null};
                  }
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


