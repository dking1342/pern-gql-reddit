import { Box } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from "next/router";
import React, { useContext } from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { UserContext } from '../context/userContext';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';



const Register: React.FC<{}> = ({}) => {
    const [_,register] = useRegisterMutation();
    const router = useRouter();
    const { registerFn } = useContext(UserContext);
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
                <h1><strong>Register</strong></h1>
            </Flex>
            <Formik
                initialValues={{username:'',email:'',password:''}}
                onSubmit={async(values,{setErrors})=>{
                    let response = await register(values);
                    registerFn(response);
                    response.data?.register.errors && setErrors(toErrorMap(response.data.register.errors));
                    response.data?.register.user?.token && router.push('/');
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField 
                            label="Username"
                            name="username"
                            placeholder="username"
                        />
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
                        <Btn 
                            type="submit"
                            text="Register"
                            isLoading={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(Register);