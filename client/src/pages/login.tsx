import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik'
import React from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";

interface loginProps {

}

const Login: React.FC<loginProps> = ({}) => {
    const [_,login] = useLoginMutation();
    const router = useRouter();

    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{username:'',password:''}}
                onSubmit={async(values,{setErrors})=>{
                    let response = await login(values);
                    if(response.data?.login.errors){
                        setErrors(toErrorMap(response.data.login.errors))
                    }
                    if(response.data?.login.user?.token){
                        let userInfo = localStorage.getItem('userInfo');

                        if(userInfo){
                            localStorage.removeItem('userInfo')
                            localStorage.setItem('userInfo',JSON.stringify(response.data.login.user.token));
                        } else {
                            localStorage.setItem('userInfo',JSON.stringify(response.data.login.user.token));
                        }
                        router.push('/');
                    }
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
        </Wrapper>
    )
}

export default Login