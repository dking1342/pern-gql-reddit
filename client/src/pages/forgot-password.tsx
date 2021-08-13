import { Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react'
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useForgotPasswordMutation } from '../generated/graphql';



const ForgotPassword: React.FC<{}> = ({}) => {
    const [_,forgotPassword] = useForgotPasswordMutation();
    const [complete,setComplete]=useState(false);

    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{email:''}}
                onSubmit={async(values)=>{
                    await forgotPassword(values);
                    setComplete(true);
                }}
            >
                {({isSubmitting}) => complete ? (
                    <Box>
                        If an email exists, we sent you an email to change your password
                    </Box>
                ) : (
                    <Form>
                        <Box mt={4}>
                            <InputField 
                                label="Email"
                                name="email"
                                placeholder="email"
                                type="email"
                            />
                        </Box>
                        <Btn 
                            type="submit"
                            text="Submit"
                            isLoading={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);