import { FormControl, FormLabel, Input, FormErrorMessage, Textarea, ComponentWithAs, TextareaProps, InputProps } from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    label:string;
    name: string;
    placeholder:string;
    type?:string;
    textarea?:boolean
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    textarea,
    size:_,
    ...props
}) => {
    let ComponentField:ComponentWithAs<"textarea", TextareaProps> | ComponentWithAs<"input", InputProps> = Input;
    if(textarea){
        ComponentField = Textarea
    }
    const [field,{error}] = useField(props);

    return(
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <ComponentField {...field} type={props.type} id={field.name} placeholder={props.placeholder} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    )
}

export default InputField