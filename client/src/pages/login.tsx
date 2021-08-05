import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik'
import React from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface loginProps {

}

const Login: React.FC<loginProps> = ({}) => {
    const [_,login] = useLoginMutation();    

    const router = useRouter();

    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{email:'',password:''}}
                onSubmit={async(values,{setErrors})=>{
                    let response = await login(values);
                    if(response.data?.login.errors){
                        setErrors(toErrorMap(response.data.login.errors))
                    }
                    if(response.data?.login.user?.token){
                        let userInfo = localStorage.getItem('userInfo');

                        if(userInfo){
                            localStorage.removeItem('userInfo')
                            localStorage.setItem('userInfo',JSON.stringify(response.data.login.user));
                        } else {
                            localStorage.setItem('userInfo',JSON.stringify(response.data.login.user));
                        }
                        router.push('/');
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