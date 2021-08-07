import { withUrqlClient } from 'next-urql';
import React from 'react';
import { usePostQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import dynamic from 'next/dynamic';

const DynamicNavbar = dynamic(()=> import('../components/Navbar'),{ssr:false})

const Index = ({}) => {
  const [{data}] = usePostQuery();

  return(
    <main>
      <DynamicNavbar />
      <div>
        reddit app
        <hr />
        {
          !data ? 
          <div>loading...</div> :
          data.posts.map(p=> <div key={p.id} >{p.title}</div>) 
        }
      </div>
    </main>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Index)
