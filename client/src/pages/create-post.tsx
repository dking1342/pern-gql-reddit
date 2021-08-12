import { Box, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';



const CreatePost: React.FC<{}> = ({}) => {
    const [_,createPost]=useCreatePostMutation();
    const [tokenErr,setTokenErr] = useState('');
    const router = useRouter();

    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{ title:'',text:''}}
                onSubmit={async(values,{setErrors})=>{
                    try {
                        let response = await createPost({input:values});
                        if(response.data?.createPost.errors){
                            const errorMap = toErrorMap(response.data!.createPost.errors)
                            if('token' in errorMap){
                                setTokenErr('Please log in to create a post');
                            }
                            setErrors(errorMap);
                        }
                        if(Boolean(response.data?.createPost.post)){
                            router.push('/');
                        }
                        
                    } catch (error) {
                        console.log('create post page error',error.message)
                    }
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Box mt={4}>
                            <InputField 
                                label="Title"
                                name="title"
                                placeholder="title"
                                type="text"
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField 
                                label="Body"
                                name="text"
                                placeholder="add text..."
                                type="text"    
                                textarea                    
                            />
                        </Box>
                        {
                            tokenErr ? (
                                <Flex>
                                    <Box color="red" mt={2}>
                                        {tokenErr}
                                    </Box>
                                </Flex>
                            ) : null
                        }
                        <Btn 
                            type="submit"
                            text="Create Post"
                            isLoading={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
};

export default withUrqlClient(createUrqlClient)(CreatePost);