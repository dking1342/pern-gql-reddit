import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '../context/userContext';
import theme from '../theme';


function MyApp({ Component, pageProps}:any) {

  return (
    <ChakraProvider resetCSS theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  )
}

export default MyApp

