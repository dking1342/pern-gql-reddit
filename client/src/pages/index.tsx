import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import Btns from '../components/Btns';
import Layout from '../components/Layout';
import Vote from '../components/Vote';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = ({}) => {
  const [variables,setVariables] = useState({
    limit:15,
    cursor:null as string | null
  })
  const [{data, fetching,stale,error}] = usePostsQuery({
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
              <Flex justify="center" mt={4} flexDirection="column" alignItems="center">
                <Heading>no posts here</Heading>
                <Text mt={2}>{error?.message}</Text>
              </Flex>
            ) : (
              <Stack>
                {
                  data!.posts.posts.map((post)=> !post ? null : (
                    <Flex p={5} shadow="md" borderWidth="1px" key={post.id} width="inherit" >
                      <Vote post={post}/>
                      <Box width="80%">
                        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                          <Link>
                            <Heading fontSize="xl">{post.title}</Heading>                        
                          </Link>
                        </NextLink>
                        <Text mt={2}>posted by: {post.creator.username}</Text>
                        <Text mt={4}>{post.textSnippet}</Text>
                      </Box>
                      <Btns owner={post.creator_id} postId={Number(post.id)} />
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

export default withUrqlClient(createUrqlClient,{ssr:false})(Index)
