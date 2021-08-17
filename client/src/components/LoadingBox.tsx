import { Flex, Box, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link';


const LoadingBox: React.FC<{}> = ({}) => {
    return(
        <Flex>
            <Box>
                Loading...
            </Box>
            <Box>
                <NextLink href='/login'>
                    <Link color="teal" variant="button" mr={2}>Go To Login</Link>
                </NextLink>
            </Box>
        </Flex>
    )
}

export default LoadingBox