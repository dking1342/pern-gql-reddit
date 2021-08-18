import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { PostsQuery, useVoteMutation } from '../generated/graphql'

interface VoteProps {
    post:PostsQuery["posts"]["posts"][0]
}

const Vote: React.FC<VoteProps> = ({post}) => {
    const [loadingState,setLoadingState] = useState<'up-load' | 'down-load' | 'not-load'>('not-load')
    const [_,vote] = useVoteMutation();

    return(
        <Box display="flex" flexDirection="column" alignItems="center" justify="center" mr={4} >
            <IconButton 
                size="md"
                variant="ghost"
                colorScheme={post.vote_status === 1 ? "whatsapp" : "blackAlpha"}
                aria-label="chevron-up"
                icon={<ChevronUpIcon w={8} h={8} />}
                onClick={async ()=>{
                    setLoadingState('up-load')
                    await vote({
                        postId:post.id,
                        value:1
                    })
                    setLoadingState('not-load');
                }}
                isLoading={loadingState==='up-load'}
                isDisabled={post.vote_status === 1 ? true : false }
            />
            <Text m="auto">{post.points}</Text>
            <IconButton 
                size="md"
                variant="ghost"
                colorScheme={post.vote_status === -1 ? "red" : "blackAlpha"}
                aria-label="chevron-up"
                icon={<ChevronDownIcon w={8} h={8} />}
                onClick={async ()=>{
                    setLoadingState('down-load');
                    await vote({
                        postId:post.id,
                        value:-1
                    })
                    setLoadingState('not-load');
                }}
                isLoading={loadingState==='down-load'}
                isDisabled={post.vote_status === -1 ? true : false}
            />
        </Box>
    )
}

export default Vote