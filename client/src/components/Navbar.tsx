import {
    ChevronDownIcon,
    ChevronRightIcon, 
    CloseIcon, 
    HamburgerIcon,
    StarIcon
} from '@chakra-ui/icons';
import {
    Box,
    Button,
    Collapse, 
    Flex,
    Icon, 
    IconButton,
    Link,
    Popover,
    PopoverContent, 
    PopoverTrigger, 
    Stack, 
    Text,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from "next/router";
import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useLogoutMutation, useUserInfoQuery } from '../generated/graphql';

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Create Post',
        href: '/create-post',
    },
//   {
//     label: 'Inspiration',
//     children: [
//       {
//         label: 'Explore Design Work',
//         subLabel: 'Trending Design to inspire you',
//         href: '#',
//       },
//       {
//         label: 'New & Noteworthy',
//         subLabel: 'Up-and-coming Designers',
//         href: '#',
//       },
//     ],
//   },
];


const Navbar: React.FC<{}> = ({}) => {
    const [{fetching:logoutFetching},logout] = useLogoutMutation();
    const { user, logoutFn, expireTokenFn } = useContext(UserContext);
    const router = useRouter();
    const handleLogout = () => {
        logout().then(res=>{
          logoutFn(res)
          logout();
          router.reload();
        });
    }
    const [{data}] = useUserInfoQuery();
    if(data?.userInfo?.user?.id === user?.id && data?.userInfo?.userTokenDetails){
      let { exp } = data.userInfo.userTokenDetails;
      const currentTimestamp = Date.now();

      if(exp * 1000 <= currentTimestamp){
        expireTokenFn(null);
        handleLogout();
      } 
    }
    const { isOpen, onToggle } = useDisclosure();
    
    const DesktopNav = () => {
      const linkColor = useColorModeValue('gray.900', 'gray.500');
      const linkHoverColor = useColorModeValue('gray.700', 'white');
      const popoverContentBgColor = useColorModeValue('white', 'gray.800');
    
      return (
        <Stack direction={'row'} spacing={4}>
          {NAV_ITEMS.map((navItem) => (
            <Box key={navItem.label}>
              <Popover trigger={'hover'} placement={'bottom-start'}>
                <PopoverTrigger>
                  <Link
                    p={2}
                    href={navItem.href ?? '#'}
                    fontSize={'sm'}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}>
                    {navItem.label}
                  </Link>
                </PopoverTrigger>
    
                {navItem.children && (
                  <PopoverContent
                    border={0}
                    boxShadow={'xl'}
                    bg={popoverContentBgColor}
                    p={4}
                    rounded={'xl'}
                    minW={'sm'}>
                    <Stack>
                      {navItem.children.map((child) => (
                        <DesktopSubNav key={child.label} {...child} />
                      ))}
                    </Stack>
                  </PopoverContent>
                )}
              </Popover>
            </Box>
          ))}
        </Stack>
      );
    };
    
    const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
      return (
        <Link
          href={href}
          role={'group'}
          display={'block'}
          p={2}
          rounded={'md'}
          _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text
                transition={'all .3s ease'}
                _groupHover={{ color: 'pink.400' }}
                fontWeight={500}>
                {label}
              </Text>
              <Text fontSize={'sm'}>{subLabel}</Text>
            </Box>
            <Flex
              transition={'all .3s ease'}
              transform={'translateX(-10px)'}
              opacity={0}
              _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
              justify={'flex-end'}
              align={'center'}
              flex={1}>
              <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
            </Flex>
          </Stack>
        </Link>
      );
    };
    
    const MobileNav = () => {
      return (
          <>
            <Stack
                bg={useColorModeValue('white', 'gray.800')}
                p={4}
                display={{ md: 'none' }}
            >
                {NAV_ITEMS.map((navItem) => (
                    <MobileNavItem key={navItem.label} {...navItem} />
                ))}
                {
                    <Stack
                        bg={useColorModeValue('white', 'gray.800')}
                        display={{ md: 'none' }}
                    >
                        {
                            Boolean(user?.username) ? (
                                <>
                                    <Stack>
                                        <Flex
                                            alignItems="center"
                                            fontSize={'md'}
                                            fontWeight={900}
                                        >
                                            {user?.username ? user!.username : null}
                                        </Flex>
                                    </Stack>
                                    <Stack>
                                        <Flex
                                            as={Button}
                                            fontSize={'sm'}
                                            style={{width:"fit-content"}}
                                            fontWeight={600}
                                            color={'white'}
                                            bg={'pink.400'}
                                            isLoading={logoutFetching} 
                                            onClick={handleLogout}
                                            _hover={{
                                            bg: 'pink.300',
                                            }}
                                        >
                                            Logout
                                        </Flex>
                                    </Stack>
                                </>
                            ) : (
                                <>
                                    <Stack spacing={4} onClick={onToggle}>
                                        <Flex
                                            as={Link}
                                            p={3}
                                            borderRadius={"10px"}
                                            href={"/login"}
                                            fontSize={'sm'}
                                            style={{width:"fit-content",textDecoration:"none"}}
                                            fontWeight={600}
                                            color={'#eee'}
                                            bg={'cyan.800'}
                                            _hover={{
                                                bg: 'cyan.900',
                                            }}                                            
                                        >
                                            Login
                                        </Flex>
                                    </Stack>
                                    <Stack spacing={4} onClick={onToggle}>
                                        <Flex
                                            as={Link}
                                            p={3}
                                            borderRadius={"10px"}
                                            href={"/register"}
                                            fontSize={'sm'}
                                            style={{width:"fit-content",textDecoration:"none"}}
                                            fontWeight={600}
                                            color={'#333'}
                                            bg={'cyan.400'}
                                            _hover={{
                                                bg: 'cyan.300',
                                            }}                                            
                                        >
                                            Register
                                        </Flex>
                                    </Stack>
                                </>
                            )
                        }
                    </Stack>
                }
            </Stack>
          </>
      );
    };
    
    const MobileNavItem = ({ label, children, href }: NavItem) => {
      const { isOpen, onToggle } = useDisclosure();
    
      return (
        <Stack spacing={4} onClick={children && onToggle}>
          <Flex
            py={2}
            as={Link}
            href={href ?? '#'}
            justify={'space-between'}
            align={'center'}
            _hover={{
              textDecoration: 'none',
            }}>
            <Text
              fontWeight={600}
              color={useColorModeValue('gray.600', 'gray.200')}>
              {label}
            </Text>
            {children && (
              <Icon
                as={ChevronDownIcon}
                transition={'all .25s ease-in-out'}
                transform={isOpen ? 'rotate(180deg)' : ''}
                w={6}
                h={6}
              />
            )}
          </Flex>
    
          <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
            <Stack
              mt={2}
              pl={4}
              borderLeft={1}
              borderStyle={'solid'}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              align={'start'}>
              {children &&
                children.map((child) => (
                  <Link key={child.label} py={2} href={child.href}>
                    {child.label}
                  </Link>
                ))}
            </Stack>
          </Collapse>
        </Stack>
      );
    };

    return (
        <Box position='sticky' top={0} zIndex={1}>
          <Flex
            bg={useColorModeValue('gray.400', 'gray.900')}
            color={useColorModeValue('white', 'white')}
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            borderBottom={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.900')}
            align={'center'}>
            <Flex
              flex={{ base: 1, md: 'auto' }}
              ml={{ base: -2 }}
              display={{ base: 'flex', md: 'none' }}>
              <IconButton
                onClick={onToggle}
                icon={
                  isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                }
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
              />
            </Flex>
            <Flex flex={{ base: 1 }} alignItems="center" justify={{ base: 'center', md: 'start' }}>
                <NextLink href="/">
                    <Link>
                        <IconButton 
                            icon={<StarIcon />}
                            variant={'ghost'}
                            aria-label={"Home"}
                        />                    
                    </Link>
                </NextLink>
    
              <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                <DesktopNav />
              </Flex>
            </Flex>
    
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={6}>

            {
                (Boolean(user?.username)) ? (
                    <>
                        <Flex
                            alignItems="center"
                            fontSize={'md'}
                            fontWeight={900}
                        >
                            {user?.username ? user!.username : <div></div>}
                        </Flex>
                        <Button
                            display={{ base: 'none', md: 'inline-flex' }}
                            fontSize={'sm'}
                            fontWeight={600}
                            color={'white'}
                            bg={'pink.400'}
                            isLoading={logoutFetching} 
                            onClick={handleLogout}
                            _hover={{
                            bg: 'pink.300',
                            }}>
                            Logout
                        </Button>
                    </>
                ) : (    
                    <>
                        <NextLink href="/login">
                            <Button
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={'pink.400'}
                                _hover={{
                                bg: 'pink.300',
                                }}>
                                Login
                            </Button>                        
                        </NextLink>
                        <NextLink href="/register"> 
                            <Button
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={'blue.400'}
                                _hover={{
                                bg: 'blue.300',
                                }}>
                                Register
                            </Button>                        
                        </NextLink>
                    </>      
                ) 
            }
            </Stack>

          </Flex>
    
          <Collapse in={isOpen} animateOpacity>
            <MobileNav />
          </Collapse>
        </Box>
      )
    }


export default Navbar;