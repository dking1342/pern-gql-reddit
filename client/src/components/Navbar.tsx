import { Box, Flex, Link } from '@chakra-ui/layout'
import React, { } from 'react'
import NextLink from 'next/link';
import { useUserInfoQuery, useLogoutMutation } from '../generated/graphql';
import { Button } from '@chakra-ui/button';

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{fetching:logoutFetching},logout] = useLogoutMutation();
    const [{data,fetching,}] = useUserInfoQuery();
    let body = null;

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        logout();
    }

    if(fetching){
        // data is loading

    } else if(Boolean(data?.userInfo?.errors?.length)){
        // user is not logged in
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
    } else {
        let isLoggedIn = data?.userInfo?.userInfo?.username;
        
        if(isLoggedIn){ // user is logged in
            let { username }:any = data?.userInfo?.userInfo;
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
        } else { // user is logged out
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
    }

    return(
        <Flex bg="cyan.900" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    )
}

export default Navbar