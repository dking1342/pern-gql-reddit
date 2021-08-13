import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik'
import React, { useContext, useEffect } from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { UserContext } from '../context/userContext';
import { Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import Layout from '../components/Layout';



const Login: React.FC<{}> = ({}) => {
    const [_,login] = useLoginMutation(); 
    const { user, loginFn } = useContext(UserContext);   
    const router = useRouter();
    
    useEffect(()=>{
        if(Boolean(user)){
            router.replace("/")
        }
    },[user])
        
    if(Boolean(user)){
        return(
            <Layout variant="small">
                <Flex justifyContent="center">
                    <Box>Loading...</Box>
                </Flex>
            </Layout>
        )
    }

    return(
        <Layout variant="small">
            <Flex mb={4} justifyContent="center">
                <h1><strong>Login</strong></h1>
            </Flex>
            <Formik
                initialValues={{email:'',password:''}}
                onSubmit={async(values,{setErrors})=>{
                    let response = await login(values);
                    loginFn(response);
                    response.data?.login.errors && setErrors(toErrorMap(response.data?.login.errors));
                    response.data?.login.user?.token && router.back();;
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Box mt={4}>
                            <InputField 
                                label="Email"
                                name="email"
                                placeholder="email"
                                type="email"
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField 
                                label="Password"
                                name="password"
                                placeholder="password"
                                type="password"
                            />
                        </Box>
                        <Flex mt={4} >
                            <NextLink href="/forgot-password">
                                <Link>Forgot Password?</Link>
                            </NextLink>
                        </Flex>
                        <Btn 
                            type="submit"
                            text="Login"
                            isLoading={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(Login)