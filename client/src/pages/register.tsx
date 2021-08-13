import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik'
import React, { useContext, useEffect } from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { UserContext } from '../context/userContext';
import Layout from '../components/Layout';
import { Flex } from '@chakra-ui/react';



const Register: React.FC<{}> = ({}) => {
    const [_,register] = useRegisterMutation();
    const { user, registerFn } = useContext(UserContext);
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