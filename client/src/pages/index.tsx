import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = ({}) => {
  const [variables,setVariables] = useState({
    limit:10,
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
                  data!.posts.posts.map((p)=> (
                    <Box p={5} shadow="md" borderWidth="1px" key={p.id}>
                      <Heading fontSize="xl">{p.title}</Heading>
                      <Text mt={4}>{p.textSnippet}</Text>
                    </Box>
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
                  onClick={()=> setVariables({limit:variables.limit,cursor:data.posts.posts[data.posts.posts.length - 1].createdAt})} 
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
