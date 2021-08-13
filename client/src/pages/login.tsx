import { Box } from '@chakra-ui/layout';
import { Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from "next/router";
import React, { useContext } from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { UserContext } from '../context/userContext';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';



const Login: React.FC<{}> = ({}) => {
    const [_,login] = useLoginMutation(); 
    const router = useRouter();
    const { loginFn } = useContext(UserContext);   
    let { user } = useIsAuth(router.route);
      
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
                    if(response.data?.login.errors){
                        setErrors(toErrorMap(response.data?.login.errors))
                    } else if(response.data?.login.user?.token){
                        if(typeof router.query.next === 'string'){
                            router.push(router.query.next)
                        } else {
                            router.push("/")
                        }
                        // worked
                    }
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