import { Box, Flex, Grid, GridItem, Icon, Link, Text,  } from '@chakra-ui/react'
import React from 'react'
import { FiHome, FiPieChart, FiUser } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

//import { FiChevronLeft } from 'react-icons/fi'

const Main = (props) => {
  return (
    <Grid gridTemplateColumns={{base: '1fr', md:'470px'}} h={'100vh'} justifyContent={'center'}>
      <GridItem position={'relative'} bg={'gray.800'} >
            <Box px={6} pb={20} pt={2}>

                <Text fontSize={'xl'} mb={4}  color={'white'}> 
                    <strong style={{color: '#3f76ff'}}>C</strong>tLab<strong style={{color: '#3f76ff'}}>.</strong>
                </Text>

                {props.component}

            </Box>

            <Flex px={10} w={{base: '100%', md:'470px'}} color={'white'} boxShadow={'0 0 12px rgba(0, 0, 0, 0.1)'} bg={'#3f76ff'}  justify={'space-between'} position={'fixed'} bottom={0} align={'center'}>

                <Link
                as={NavLink}
                display={'flex'} 
                flexDir={'column'}
                py={2} 
                gap={1} 
                to={'/'}
                alignItems={'center'}
                role="group"
                cursor="pointer"
                _activeLink={{ borderTop: "2px solid", borderLeftColor: 'white'}}
                _hover={{ 
                    textDecoration: 'none',
                    color: 'gray.800'
                }}
                >
                    <Icon as={FiHome}/>
                    <Text fontSize={'xs'}>Accueil</Text>
                </Link>

                <Link
                as={NavLink}
                display={'flex'} 
                flexDir={'column'}
                py={2} 
                gap={1} 
                to={'/machine'}
                alignItems={'center'}
                role="group"
                cursor="pointer"
                _activeLink={{ borderTop: "2px solid", borderLeftColor: 'white'}}
                _hover={{ 
                    textDecoration: 'none',
                    color: 'gray.800'
                }}
                >
                    <Icon as={FiPieChart}/>
                    <Text fontSize={'xs'}>Machine</Text>
                </Link>

                <Link
                as={NavLink}
                display={'flex'} 
                flexDir={'column'}
                py={2} 
                gap={1} 
                to={'/profile/Account'}
                alignItems={'center'}
                role="group"
                cursor="pointer"
                _activeLink={{ borderTop: "2px solid", borderLeftColor: 'white'}}
                _hover={{ 
                    textDecoration: 'none',
                    color: 'gray.800'
                }}
                >
                    <Icon as={FiUser}/>
                    <Text fontSize={'xs'}>Profil</Text>
                </Link>

            </Flex>
      </GridItem>
    </Grid>
  )
}

export default Main
