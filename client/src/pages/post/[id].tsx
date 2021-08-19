import { Box, Flex, Heading, Text } from '@chakra-ui/layout'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import Layout from '../../components/Layout'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useGetPost } from '../../utils/useGetPost'



const Post: React.FC<{}> = ({}) => {
    const [{data,fetching,error}] = useGetPost();

    if(fetching){
        return(
            <Layout>
                <div>loading...</div>
            </Layout>
        )        
    }
    if(!data?.post && error){
        return(
            <Layout>
                <Box>
                    Could not find the post
                </Box>
            </Layout>
        )
    }
    return(
        <Layout>
            <Flex justify="center">
                <Box>
                    <Heading mb={2}>{data?.post.title}</Heading>
                    <Text>{data?.post.text}</Text>
                    <Text>by: {data?.post.creator.username}</Text>
                </Box>
            </Flex>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Post);