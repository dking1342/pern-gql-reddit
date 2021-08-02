import React from 'react'
import Navbar from '../components/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostQuery } from '../generated/graphql';

interface indexProps {

}

const Index: React.FC<indexProps> = ({}) => {
  const [{data}] = usePostQuery();
  console.log(data);
  return(
    <>
      <Navbar />
      <div>
        reddit app
      </div>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Index)
