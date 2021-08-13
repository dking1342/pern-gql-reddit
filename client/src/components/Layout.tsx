import React from 'react'
import Wrapper, { WrapperVariant } from './Wrapper'
import dynamic from 'next/dynamic';

const DynamicNavbar = dynamic(()=> import('./Navbar'),{ssr:false})

interface LayoutProps {
    variant?:WrapperVariant
}

const Layout: React.FC<LayoutProps> = ({variant,children}) => {

    return(
        <>
            <DynamicNavbar />
            <Wrapper variant={variant}>
                { children }
            </Wrapper>
        </>
    )
}

export default Layout