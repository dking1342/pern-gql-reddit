import { Box, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';
import dynamic from 'next/dynamic';

const DynamicLoadingBox = dynamic(()=> import('../components/LoadingBox'),{ssr:false});

const CreatePost: React.FC<{}> = ({}) => {
    const [_,createPost]=useCreatePostMutation();
    const [tokenErr,setTokenErr] = useState('');
    const router = useRouter();
    let { user } = useIsAuth(router.route);

    return(
        <Layout variant="small">
            {
                (!Boolean(user)) && <DynamicLoadingBox />
            }
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

export default withUrqlClient(createUrqlClient,{ssr:false})(CreatePost);