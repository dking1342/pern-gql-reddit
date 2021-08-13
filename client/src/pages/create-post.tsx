import { Box, Flex,Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { UserContext } from '../context/userContext';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import NextLink from 'next/link';



const CreatePost: React.FC<{}> = ({}) => {
    const [_,createPost]=useCreatePostMutation();
    const [tokenErr,setTokenErr] = useState('');
    const router = useRouter();
    const { user } = useContext(UserContext);

    useEffect(()=>{
        if(!Boolean(user)){
            router.replace('/login');
        }
    },[user])


    if(!Boolean(user)){
        return(
            <Layout variant="small">
                <Flex>
                    <Box>
                        Loading...
                    </Box>
                    <Box>
                        <NextLink href='/login'>
                            <Link color="teal" variant="button" mr={2}>Go To Login</Link>
                        </NextLink>
                    </Box>
                </Flex>
            </Layout>
        )
    }

    return(
        <Layout variant="small">
            <Formik
                initialValues={{ title:'',text:''}}
                onSubmit={async(values,{setErrors})=>{
                    try {
                        let response = await createPost({input:values});
                        if(response.data?.createPost.errors){
                            const errorMap = toErrorMap(response.data!.createPost.errors)
                            if('token' in errorMap){
                                setTokenErr('Please log in to create a post');
                                setTimeout(()=> router.push('/login'),2000)
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
        </Layout>
    )
};

export default withUrqlClient(createUrqlClient)(CreatePost);