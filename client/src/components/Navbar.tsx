import { Box, Flex, Link } from '@chakra-ui/layout'
import React, { } from 'react'
import NextLink from 'next/link';
import { useUserInfoQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/button';

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{data,fetching,}] = useUserInfoQuery();
    console.log('data',Boolean(data?.userInfo?.errors?.length))
    let body = null;

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
        // user is logged in
        let { username }:any = data?.userInfo?.userInfo;
        body = (
            <Box>
                {username}
            </Box>
        )
    }


    const handleLogout = () => {
        localStorage.removeItem('userInfo');
    }

    return(
        <Flex bg='tomato' p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
            <Button onClick={handleLogout}>Logout</Button>
        </Flex>
    )
}

export default Navbar