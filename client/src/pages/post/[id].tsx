import { Box, Flex, Heading, Text } from '@chakra-ui/layout'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import Btns from '../../components/Btns'
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
    if(data?.post){
        return(
            <Layout>
                <Flex justify="center" width="100%">
                    <Box width="90%" textAlign="center">
                        <Heading mb={2}>{data.post.title}</Heading>
                        <Text>{data?.post.text}</Text>
                        <Text>by: {data.post.creator.username}</Text>
                    </Box>
                    <Btns owner={data.post.creator_id} postId={Number(data.post.id)} />
                </Flex>
            </Layout>
        )
    }
    return <Layout></Layout>
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Post);