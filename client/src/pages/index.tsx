import { withUrqlClient } from 'next-urql';
import React from 'react';
import Navbar from '../components/Navbar';
import { usePostQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface indexProps {

}

const Index: React.FC<indexProps> = ({}) => {
  const [{data}] = usePostQuery();
  return(
    <>
      <Navbar />
      <div>
        reddit app
        <hr />
        {
          !data ? 
          <div>loading...</div> :
          data.posts.map(p=> <div key={p.id} >{p.title}</div>) 
        }
      </div>
    </>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:true})(Index)
