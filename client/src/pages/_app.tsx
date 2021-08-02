import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { authExchange } from '@urql/exchange-auth';
import { Provider, createClient, cacheExchange, dedupExchange, fetchExchange } from 'urql';
import { makeOperation } from '@urql/core';
import theme from '../theme';

const client = createClient({
  url:'http://localhost:4000/graphql',
  exchanges: [
    dedupExchange,
    cacheExchange,
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
      getAuth: async ({ authState }) => {
        // for initial launch, fetch the auth state from storage (local storage, async storage etc)
        if (!authState) {
          const isUser = localStorage.getItem('userInfo');

          if(isUser){
            const {token} = JSON.parse(localStorage.getItem('userInfo')!);
            return {
              token
            }
          }
          return null;
        }

        // your app logout logic should trigger here
        // logout();

        return null;
      },

    }),
    fetchExchange,
  ],  
});

function MyApp({ Component, pageProps }:any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
