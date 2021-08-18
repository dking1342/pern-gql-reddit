import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Vote from '../components/Vote';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = ({}) => {
  const [variables,setVariables] = useState({
    limit:15,
    cursor:null as string | null
  })
  const [{data, fetching,stale}] = usePostsQuery({
    variables,
  });

  return(
    <main>
      <Layout variant="regular">
        <Flex mb={2} alignItems="center">
          <Heading>Reddit Clone</Heading>
        </Flex>
          {
            fetching && !data?.posts.posts ? (
              <Flex justify="center" mt={4}>
                <Heading>loading...</Heading>
              </Flex>
            ) : !fetching && !data?.posts.posts ? (
              <Flex justify="center" mt={4}>
                <Heading>no posts here</Heading>
              </Flex>
            ) : (
              <Stack>
                {
                  data!.posts.posts.map((post)=> (
                    <Flex p={5} shadow="md" borderWidth="1px" key={post.id}>
                      <Vote post={post}/>
                      <Box>
                        <Heading fontSize="xl">{post.title}</Heading>
                        <Text mt={2}>posted by: {post.creator.username}</Text>
                        <Text mt={4}>{post.textSnippet}</Text>
                      </Box>
                    </Flex>
                  ))
                }
              </Stack>
            )
          }
          {
            data && data.posts.hasMore ? (
              <Flex>
                <Button 
                  isLoading={stale} 
                  m='auto' 
                  my={8} 
                  backgroundColor={"gray.800"} color={"white"}
                  onClick={()=>setVariables({limit:variables.limit,cursor:data.posts.posts[data.posts.posts.length - 1].createdAt})}
                >
                  load more
                </Button>
              </Flex>
            ) : ( null )
          }
      </Layout>
    </main>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:true})(Index)
