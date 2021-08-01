import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label:string;
    name: string;
    placeholder:string;
    type?:string;
}

const InputField: React.FC<InputFieldProps> = (props) => {
    const [field,{error}] = useField(props);

    return(
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            <Input {...field} type={props.type} id={field.name} placeholder={props.placeholder} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    )
}

export default InputField