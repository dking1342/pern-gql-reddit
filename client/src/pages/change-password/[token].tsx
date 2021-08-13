import { Formik, Form } from 'formik';
import { NextPage } from 'next'
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import Btn from '../../components/Btn';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { UserContext } from '../../context/userContext';
import NextLink from 'next/link';
import { Box, Flex, Link } from '@chakra-ui/layout'


const ChangePassword: NextPage = () => {
    const [_,changePassword]=useChangePasswordMutation();
    const router = useRouter();
    const [tokenErr,setTokenErr] = useState('');
    const { changePasswordFn } = useContext(UserContext);

    return(
        <>
            <Wrapper variant="small">
                <Formik
                    initialValues={{newPassword:''}}
                    onSubmit={async(values,{setErrors})=>{
                        try {
                            let response = await changePassword({
                                newPassword:values.newPassword,
                                token: typeof router.query.token === "string" ? router.query.token : "",
                            });
                            changePasswordFn(response);
                            if(Boolean(response.data?.changePassword.errors)){
                                const errorMap = toErrorMap(response.data!.changePassword.errors!);
                                if('token' in errorMap){
                                    setTokenErr(errorMap.token);
                                } 
                                setErrors(errorMap);
                                
                            } 
                            if(Boolean(response.data?.changePassword.user)){
                                router.push("/");
                            }
                        } catch (error) {
                            console.log('change password page',error)
                        }
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Box mt={4}>
                                <InputField 
                                    label="New Password"
                                    name="newPassword"
                                    placeholder="new password"
                                    type="password"
                                />
                            </Box>
                            { tokenErr ? (
                                <Flex>
                                    <Box color="red" mr={2}>{tokenErr}</Box>
                                    <NextLink href="/forgot-password">
                                        <Link>Get New Password</Link>
                                    </NextLink>
                                </Flex>
                            ) : null}
                            <Btn 
                                type="submit"
                                text="Submit"
                                isLoading={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    )
}



export default withUrqlClient(createUrqlClient)(ChangePassword as any);