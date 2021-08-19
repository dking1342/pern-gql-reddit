import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import Vote from '../components/Vote';
import { useDeletePostMutation, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { DeleteIcon } from '@chakra-ui/icons';
import { UserContext } from '../context/userContext';

const Index = ({}) => {
  const [variables,setVariables] = useState({
    limit:15,
    cursor:null as string | null
  })
  const [{data, fetching,stale}] = usePostsQuery({
    variables,
  });
  const [_,deletePost] = useDeletePostMutation();
  let { user } = useContext(UserContext);

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
                      <Box width="10%">
                        {
                          post.creator_id === user?.id ? (
                            <IconButton
                              colorScheme="red"
                              aria-label="delete post"
                              icon={<DeleteIcon />}
                              onClick={()=>{
                                let id = Number(post.id);
                                deletePost({id})
                              }}
                            />
                          ) : null
                        }
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

export default withUrqlClient(createUrqlClient,{ssr:false})(Index)
