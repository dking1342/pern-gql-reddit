import { Box, Flex, Heading, Text } from '@chakra-ui/layout'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../components/Layout'
import { usePostQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'



const Post: React.FC<{}> = ({}) => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? Number(router.query.id) : -1
    const [{data,fetching,error}] = usePostQuery({
        pause: intId === -1,
        variables:{
            id: intId
        }
    });
    console.log(data)

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