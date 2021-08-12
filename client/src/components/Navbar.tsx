import { Box, Flex, Link } from '@chakra-ui/layout'
import React, { useContext } from 'react'
import NextLink from 'next/link';
import { useLogoutMutation } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { UserContext } from '../context/userContext';




const Navbar: React.FC<{}> = ({}) => {
    const [{fetching:logoutFetching},logout] = useLogoutMutation();
    const { user,errors,logoutFn } = useContext(UserContext);
    const handleLogout = () => {
        logout().then(res=>logoutFn(res));
        logout();
    }

    return(
        <Flex bg="cyan.900" p={4}>
            <Box ml={"auto"}>
                {
                    (Boolean(errors.length)) ? (
                        <>
                            <NextLink href='/login'>
                                <Link color="white" mr={2}>login</Link>
                            </NextLink>
                            <NextLink href='/register'>
                                <Link color="white">register</Link>
                            </NextLink>
                        </>        
                    ) : (Boolean(user?.username)) ? (
                        <Flex>
                            <NextLink href='/create-post'>
                                <Link color="white" mr={3}>create post</Link>
                            </NextLink>
                            <Box mr={2}>
                                {user?.username ? user!.username : <div></div>}
                            </Box>
                            <Button isLoading={logoutFetching} variant='link' color="white" onClick={handleLogout}>
                                logout
                            </Button>
                        </Flex>
                    ) : (
                        <>
                            <NextLink href='/login'>
                                <Link color="white" mr={2}>login</Link>
                            </NextLink>
                            <NextLink href='/register'>
                                <Link color="white">register</Link>
                            </NextLink>
                        </>   
                    )
                }
            </Box>
        </Flex>
    )
}

export default Navbar;