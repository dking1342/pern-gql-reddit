import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik'
import React from 'react';
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
    const [_,register] = useRegisterMutation();
    const router = useRouter();

    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{username:'',password:''}}
                onSubmit={async(values,{setErrors})=>{
                    let response = await register(values);
                    if(response.data?.register.errors){
                        setErrors(toErrorMap(response.data.register.errors))
                    }
                    if(response.data?.register.user?.token){
                        let userInfo = localStorage.getItem('userInfo');

                        if(userInfo){
                            localStorage.removeItem('userInfo')
                            localStorage.setItem('userInfo',JSON.stringify(response.data.register.user));
                        } else {
                            localStorage.setItem('userInfo',JSON.stringify(response.data.register.user));
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

export default withUrqlClient(createUrqlClient)(Register);