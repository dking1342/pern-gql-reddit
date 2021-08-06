import { Box, Flex, Link } from '@chakra-ui/layout'
import React, { useContext } from 'react'
import NextLink from 'next/link';
import { useLogoutMutation } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { UserContext } from '../context/userContext';

interface NavbarProps {

}


const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{fetching:logoutFetching},logout] = useLogoutMutation();
    const { user,errors,logoutFn } = useContext(UserContext);    
    let body = null;

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        logout().then(res=>logoutFn(res));
        logout();
    }

    if(Boolean(errors)){
        body = (
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

    if(Boolean(user)){
        let { username }:any = user;
        body = (
            <Flex>
                <Box mr={2}>
                    {username}
                </Box>
                <Button isLoading={logoutFetching} variant='link' color="white" onClick={handleLogout}>
                    logout
                </Button>
            </Flex>
        )
    }

    return(
        <Flex bg="cyan.900" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    )
}

export default Navbar;