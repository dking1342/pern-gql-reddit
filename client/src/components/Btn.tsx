import { Button } from '@chakra-ui/button'
import React, { ButtonHTMLAttributes } from 'react'

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    text:string;
    isLoading:any;
}

const Btn: React.FC<BtnProps> = (props) => {
    return(
        <Button
            type={props.type}
            backgroundColor="teal"
            isLoading={props.isLoading}
            color="white"
            mt={4}
        >
            {props.text}
        </Button>
    )
}

export default Btn