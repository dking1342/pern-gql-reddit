import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';


const Index = ({}) => {
  const [{data}] = usePostsQuery({
    variables:{
      limit:10,
      cursor:""
    }
  });

  return(
    <main>
      <Layout variant="regular">
        <Flex mb={2} alignItems="center">
          <Heading>Reddit Clone</Heading>
        </Flex>
          {
            !data ? 
            <div>loading...</div> :
            <Stack>
              {
                data.posts.map((p)=> (
                  <Box p={5} shadow="md" borderWidth="1px" key={p.id}>
                    <Heading fontSize="xl">{p.title}</Heading>
                    <Text mt={4}>{p.textSnippet}</Text>
                  </Box>
                ))
              }
            </Stack>
          }
      </Layout>
    </main>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Index)
