import { Box, Flex, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Btn from '../../../components/Btn'
import InputField from '../../../components/InputField'
import Layout from '../../../components/Layout'
import { useUpdatePostMutation } from '../../../generated/graphql'
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { useGetPost } from '../../../utils/useGetPost'


const EditPost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [formError, setFormError] = useState('');
    const [{data,fetching,error}] = useGetPost()
    const [_,updatePost] = useUpdatePostMutation();

    if(fetching){
        return(
            <Layout>
                <Heading>loading...</Heading>
            </Layout>
        )        
    }
    if(!data?.post && error){
        return(
            <Layout>
                <Box>
                    Could not find the post
                </Box>
            </Layout>
        )
    }

    if(data?.post){
        return(
            <Layout variant="small">
                <Formik
                    initialValues={{ id:Number(data.post.id), title:data.post.title,text:data.post.text}}
                    onSubmit={async(values)=>{
                        try {
                            let response = await updatePost(values);
                            if(response.data?.updatePost === null){
                                setFormError('Error when editing the post. Make sure you are logged in and try again');
                            } else {
                                router.back();
                            }
                        } catch (error) {
                            console.log('edit page error',error.message);
                            setFormError(error.message);
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
                                formError ? (
                                    <Flex>
                                        <Box color="red" mt={2}>
                                            {formError}
                                        </Box>
                                    </Flex>
                                ) : null
                            }
                            <Btn 
                                type="submit"
                                text="Edit Post"
                                isLoading={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </Layout>
        )
    }
    return <Layout></Layout>
}

export default withUrqlClient(createUrqlClient)(EditPost)