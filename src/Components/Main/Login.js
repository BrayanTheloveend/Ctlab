import { Box, Button, Flex, FormControl,Link, FormHelperText, FormLabel, Grid, GridItem, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'

import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  getDoc
} from "firebase/firestore";
import { auth, db } from '../Firebase/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { CodeGenerator } from '../../theme';


const Login = () => {

    //DATA

    const [passwordType, setPasswordType] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    
    const [validInput, setValidInput] = useState({
        name: false,
        surname: false,
        mobile: false,
        email: false,
        code: false,
        password: false,
    })

    const navigate =useNavigate()

    const [message, setMessage] = useState({
        email: 'This fields is required',
        password: 'This fields is required'
    })


      const [payload, setPayload] = useState({
        name: '',
        surname: '',
        code: '',
        mobile: '',
        email: '',
        password: '',
      })




    //FIRE BASE


    const collectionRef = collection(db, "users");


    const handleSubmit = async (e)=>{
        e.preventDefault()
    
        if(!payload.name){
          setValidInput({ 
            name: true,
            surname: false,
            mobile: false,
            email: false,
            code: false,
            password: false,
          })
        }else if(!payload.surname){
          setValidInput({ 
            name: false,
            surname: true,
            mobile: false,
            email: false,
            code: false,
            password: false,
          })
        }else if(payload.mobile.length !== 9 ){
          setValidInput({ 
            name: false,
            surname: false,
            mobile: true,
            email: false,
            code: false,
            password: false,
          })
        }else if(!payload.email){
          setValidInput({ 
            name: false,
            surname: false,
            mobile: false,
            email: true,
            code: false,
            password: false,
          })
        }else if(payload.code === '/'){
          setValidInput({ 
            name: false,
            surname: false,
            mobile: false,
            email: false,
            code: true,
            password: false,
          })
        }else if(payload.password.length < 8 ){
          setValidInput({ 
            name: false,
            surname: false,
            mobile: false,
            email: false,
            code: false,
            password: true,
             })
        }
        // POST REQUEST  
    
        else {
        
        setIsLoading(true)
          setValidInput({ 
            name: false,
            surname: false,
            mobile: false,
            email: false,
            code: false,
            password: false,
          })
          
          await getDocs(query(collectionRef,where('email','==',payload.email)))
          .then(async userfound=>{
            if(!userfound.empty){
                console.log('email already in use !!')
                setIsLoading(false);
            }else{

                await getDocs(query(collectionRef,where('codeparrain','==',payload.code)))
                .then(async parain =>{
                    //console.log(parain.docs)
                    await addDoc(collectionRef, {...payload, codeparrain: CodeGenerator(6) , TimeStamp: new Date(), friends: !parain.empty ? [parain.docs[0].id] : [], machine: [], minning: false, solde: 0, allowWidthdraw: 0, history: []})
                        .then(async resp =>{
                            //console.log(resp)

                            createUserWithEmailAndPassword(auth, payload.email, payload.password)
                             .then(async(userCredential) => {
                                // Signed up 
                                const user = userCredential.user;
                                console.log(user)

                                await getDoc(doc(db, "users", resp?.id))
                                .then(response=>{

                                localStorage.setItem('userData', JSON.stringify({...response.data(), userId: resp?.id, token: user.accessToken}))
                                setIsLoading(false)
                                //  console.log(resp.data())
                                setPayload({
                                    name: '',
                                    surname: '',
                                    mobile: '',
                                    email: '',
                                    code: '',
                                    password: '',
                                })

                                setTimeout(navigate, 0, '/')

                             })

                             // ...
                         })
                         .catch((error) => {
                             const errorCode = error.code;
                             const errorMessage = error.message;
                             console.log(errorCode, errorMessage)
                             // ..
                         });

                        
                    })
                    .catch(err=>{
                        //showMessage('error', err.data.message, 'Add Task', 7000, 'top-center');
                        setIsLoading(false);
                    })
                })
            }
          })
           
            
    }}

    
  return (
    <Grid gridTemplateColumns={{base: '1fr', md:'470px'}} h={'100vh'} justifyContent={'center'}>
      <GridItem position={'relative'} bg={'gray.800'} >
            <Box px={6} pb={20} pt={2}>

                <Text fontSize={'xl'} mb={4}  color={'white'}> 
                    <strong style={{color: '#3f76ff'}}>C</strong>tLab<strong style={{color: '#3f76ff'}}>.</strong>
                </Text>


                <Text align={'center'} fontSize={'xl'} fontWeight={600} mt={4} color={'gray.300'}> Creation de Compte </Text>

                <Flex gap={4} mt={6}>
                    <FormControl>
                        <FormLabel color={'gray.600'} fontSize={'sm'}>
                            Nom
                        </FormLabel>
                        <Input color={'gray.400'} onChange={e=> setPayload({...payload, name: e.target.value})} value={payload.name} placeholder='nom'/>
                    { validInput.name && <FormHelperText color={'red.400'} fontSize={'xs'}> Ce champ est requis! </FormHelperText>}    
                    </FormControl>
                    <FormControl>
                        <FormLabel color={'gray.600'} fontSize={'sm'}>
                            Pseudo
                        </FormLabel>
                        <Input color={'gray.400'} onChange={e=> setPayload({...payload, surname: e.target.value})} value={payload.surname} placeholder='pseudo'/>
                { validInput.surname && <FormHelperText color={'red.400'} fontSize={'xs'}> Ce champ est requis! </FormHelperText>}    
                    </FormControl>
                </Flex>

                <FormControl mt={2}>
                    <FormLabel color={'gray.600'} fontSize={'sm'}>
                        Telephone
                    </FormLabel>
                    <Input type='number' color={'gray.400'} onChange={e=> setPayload({...payload, mobile: e.target.value})} value={payload.mobile} placeholder='Numero de Téléphone'/>
                { validInput.mobile && <FormHelperText color={'red.400'} fontSize={'xs'}> Ce champ est requis! </FormHelperText>}
                </FormControl>

                <FormControl mt={2}>
                    <FormLabel color={'gray.600'} fontSize={'sm'}>
                        Email
                    </FormLabel>
                    <Input color={'gray.400'} onChange={e=> setPayload({...payload, email: e.target.value})} value={payload.email} placeholder='Courriel'/>
                { validInput.email && <FormHelperText color={'red.400'} fontSize={'xs'}> Ce champ est requis! </FormHelperText>}
                </FormControl>

                <FormControl mt={2}>
                    <FormLabel color={'gray.600'} fontSize={'sm'}>
                        code de parrainage
                    </FormLabel>
                    <Input color={'gray.400'} onChange={e=> setPayload({...payload, code: e.target.value})} value={payload.code} placeholder='Ctlab code'/>
                { validInput.code && <FormHelperText color={'red.400'} fontSize={'xs'}> Ce champ est requis! </FormHelperText>}
                </FormControl>

                <FormControl mt={2} id="password">
                    <FormLabel color={'gray.600'} fontSize={'sm'}>
                        Mot de passe
                    </FormLabel>
                    <InputGroup>
                        <Input color={'gray.400'} onChange={e=> setPayload({...payload, password: e.target.value})} type={passwordType ? 'password': 'text'} value={payload.password}  placeholder='Choissir un mot de passe'/>
                        <InputRightElement color={'blue.400'}  onClick={()=>setPasswordType(!passwordType)}>
                            { passwordType ? <FaEye/> : <FaEyeSlash/>}
                        </InputRightElement>
                    </InputGroup>
                    { validInput.password && <FormHelperText color={'red.500'}>{message.password}</FormHelperText>}
                </FormControl>


                <Button 
                    mt={10}
                    w={'100%'}
                    fontWeight={400}
                     isLoading={isLoading} 
                     onClick={handleSubmit}
                    bg={'#3f76ff'} 
                    colorScheme={'blue'} variant={'solid'}>
                    S'inscrire
                </Button>

                <Flex justify={'center'} mt={8}>
                    <Link as={NavLink} color='white' mt={4} to={'/regis'} textAlign={'center'} fontSize={'sm'}>Se connecter</Link>
                </Flex>



                

                

            </Box>
        </GridItem>
    </Grid>
  )
}

export default Login
