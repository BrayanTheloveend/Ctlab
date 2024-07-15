import { Box, Button, Flex, FormControl,Link, FormHelperText, FormLabel, Grid, GridItem, Input, InputGroup, InputRightElement, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth, db } from '../Firebase/Firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'


const Registration = () => {

    const [passwordType, setPasswordType] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [valid, setValid] = useState(true)
    const collectionRef = collection(db, "users");
    const navigate = useNavigate()
    const [payload, setPayload] = useState({
        email: '',
        password: ''
    })

    useEffect(()=>{
        if(payload.email && payload.password){
            setValid(true)
        }else{
            setValid(false)
        }
    }, [payload])


    

    const handleSubmit = ()=>{
        setIsLoading(true)
        setAlert(false)
        signInWithEmailAndPassword(auth, payload.email, payload.password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;

                await getDocs(query(collectionRef,where('email','==',payload.email)))
                .then(async result => {

                    let snapshot = result.docs.map(doc => doc.data())

                    console.log(snapshot)
                    localStorage.setItem('userData', JSON.stringify({...user, userId: result.docs[0].id, ...snapshot[0] }))
                    setIsLoading(false)
                    setTimeout(navigate, 0, '/Profile/Account')
                }).catch((err) => {
                    console.log(err)
                    setIsLoading(false)
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)

                if(errorMessage === 'Firebase: Error (auth/invalid-email).'){
                    setAlert(true)
                }
                setIsLoading(false)

        });
    }



  return (
    <Grid gridTemplateColumns={{base: '1fr', md:'470px'}} h={'100vh'} justifyContent={'center'}>
      <GridItem position={'relative'} bg={'gray.800'} >
            <Box px={6} pb={20} pt={2}>

                <Text fontSize={'xl'} mb={4}  color={'white'}> 
                    <strong style={{color: '#3f76ff'}}>C</strong>tLab<strong style={{color: '#3f76ff'}}>.</strong>
                </Text>

                <Text align={'center'} fontSize={'xl'} fontWeight={600} mt={4} color={'gray.300'}> Connexion </Text>
            


                {alert && <Alert color={'white'} w={'100%'} bg={'transparent'} mt={2} status='error' size={'xs'}>
                    <AlertIcon />
                    <AlertTitle fontSize={'xs'} color={'red.400'}>Mot de passe ou email invalide.</AlertTitle>
                </Alert>}

                <FormControl mt={2}>
                    <FormLabel color={'gray.600'} fontSize={'sm'}>
                        Email
                    </FormLabel>
                    <Input color={'gray.400'} onChange={e=> setPayload({...payload, email: e.target.value})} value={payload.email} placeholder='Courriel'/>
                </FormControl>

                <FormControl mt={2} id="password">
                    <FormLabel color={'gray.600'} fontSize={'sm'}>
                        Mot de passe
                    </FormLabel>
                    <InputGroup>
                        <Input color={'gray.400'} value={payload.password} onChange={e=> setPayload({...payload, password: e.target.value})} type={passwordType ? 'password': 'text'} placeholder='mot de passe'/>
                        <InputRightElement color={'blue.400'}  onClick={()=>setPasswordType(!passwordType)}>
                            { passwordType ? <FaEye/> : <FaEyeSlash/>}
                        </InputRightElement>
                    </InputGroup>
                    {/* { valid.password && <FormHelperText color={'red.500'}>{message.password}</FormHelperText>} */}
                </FormControl>


                <Button 
                    mt={10}
                    w={'100%'}
                    fontWeight={400}
                    isLoading={isLoading} 
                    onClick={handleSubmit}
                    bg={'#3f76ff'} 
                    isDisabled={!valid}
                    colorScheme={'blue'} variant={'solid'}>
                    Se connecter
                </Button>

                <Flex justify={'center'} mt={8}>
                    <Link as={NavLink} color='#3f76ff' mt={4} to={'/login'} textAlign={'center'} fontSize={'sm'}>S'inscrire</Link>
                </Flex>



                

                

            </Box>
        </GridItem>
    </Grid>
  )
}

export default Registration
