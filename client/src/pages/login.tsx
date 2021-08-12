import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik'
import React, { useContext } from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { UserContext } from '../context/userContext';
import { Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';



const Login: React.FC<{}> = ({}) => {
    const [_,login] = useLoginMutation(); 
    const { loginFn } = useContext(UserContext);   
    const router = useRouter();

    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{email:'',password:''}}
                onSubmit={async(values,{setErrors})=>{
                    let response = await login(values);
                    loginFn(response);
                    response.data?.login.errors && setErrors(toErrorMap(response.data?.login.errors));
                    response.data?.login.user?.token && router.push('/');
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
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Login)