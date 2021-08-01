import { Button } from '@chakra-ui/button';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik'
import React from 'react'
import Btn from '../components/Btn';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

interface registerProps {

}



const Register: React.FC<registerProps> = ({}) => {
    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{username:'',password:''}}
                onSubmit={(values)=>{
                    console.log(values);
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

export default Register