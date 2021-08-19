import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useDeletePostMutation } from '../generated/graphql';

interface BtnsProps {
    postId:number
    owner:number
}

const Btns: React.FC<BtnsProps> = ({owner,postId}) => {
    const [_,deletePost] = useDeletePostMutation();
    let { user } = useContext(UserContext);

    if(owner !== user?.id){
        return null;

    } 

    return(
        <Flex width="10%" flexDirection="column" alignItems="flex-end" justify="space-between">
            <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
            <IconButton
                as={Link}
                colorScheme="facebook"
                color="ivory"
                aria-label="edit post"
                icon={<EditIcon />}
            />
            </NextLink>
            <IconButton
                colorScheme="red"
                aria-label="delete post"
                icon={<DeleteIcon />}
                onClick={()=>{
                    deletePost({id:postId})
                }}
            />
        </Flex>
    )
}

export default Btns
