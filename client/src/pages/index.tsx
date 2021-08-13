import { withUrqlClient } from 'next-urql';
import React from 'react';
import { usePostQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Layout from '../components/Layout';


const Index = ({}) => {
  const [{data}] = usePostQuery();

  return(
    <main>
      <Layout variant="regular">
        <div>
          reddit app
          <hr />
          {
            !data ? 
            <div>loading...</div> :
            data.posts.map(p=> <div key={p.id} >{p.title}</div>) 
          }
        </div>
      </Layout>
    </main>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Index)
