import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { getRequestTopayStatut } from '../../MONETBILL/monetbill'

const ValidatePayment = () => {

    const {state, machineId, amount} = useParams()
    const [isLoading, setIsLoading]=useState(false)
    const [show, setShow]=useState(false)
    const collectionRef = collection(db, "history");
    const savedData = JSON.parse(localStorage.getItem('userData'))
    
    const navigate = useNavigate()

    const getStatus = async ()=>{
        setIsLoading(true)

        const datafetched = await getDoc(doc(db, "users", savedData?.userId))
        let result = datafetched.data()
        const userDoc = doc(db, "users", savedData?.userId)
        let newFields ={}

        await getRequestTopayStatut()
        .then(async resp=> {
            console.log(resp)
            if(resp.status === 200){
                if(machineId === 'none'){
                    setIsLoading(false)
                    setShow(false)
                    
                    const add = await addDoc(collectionRef, {statut: false, design: 'Achat machine', TimeStamp: new Date(), amount: parseInt(amount)})
                    newFields = {  TimeStamp : new Date(), minnig: false, history: [...result.history, add.id], solde: parseInt(amount) + result?.solde };
                    await updateDoc(userDoc, newFields);

                    setTimeout(navigate, 480000,'/profile/Account')
                    //alert('Paiment effectué avec Succes!')
                }else{
                    

                    const add = await addDoc(collectionRef, {statut: false, design: 'Achat machine', TimeStamp: new Date(), amount: parseInt(amount)})
                    newFields = { machine: [ ...result.machine, machineId], TimeStamp : new Date(), minnig: true, history: [...result.history, add.id]  };
                    await updateDoc(userDoc, newFields);

                    
                    setShow(false)
                    setIsLoading(false)
                    setTimeout(navigate, 480000, '/profile/Machines')
                }
                    
            }else{
                setShow(true)
                setIsLoading(false)
                if(machineId === 'none'){
                    setTimeout(navigate, 1800, '/transWidthRem/noreply/machine/none/amout/2000')
                }else{
                    setTimeout(navigate, 1800, `/transWidthRem/noreply/machine/${machineId}/amout/${amount}`)
                }
            }
        })
        .catch(err=> {
            setIsLoading(false)
            console.log(err)
        })
    }

    useEffect(() => {
        getStatus()
    }, [])




  return (
    <Grid gridTemplateColumns={{base: '1fr', md:'470px'}} h={'100vh'} justifyContent={'center'}>
      <GridItem position={'relative'} bg={'gray.800'} >
            <Box px={6} pb={20} pt={2}>
                <Text fontSize={'xl'} mb={4}  color={'white'}> 
                    <strong style={{color: '#3f76ff'}}>C</strong>tLab<strong style={{color: '#3f76ff'}}>.</strong>
                </Text>

                <Alert
                    mt={8}
                    color={'gray.400'}
                    status='warning'
                    variant='subtle'
                    flexDirection='column'
                    alignItems='center'
                    bg={'transparent'}
                    justifyContent='center'
                    textAlign='center'
                    
                    >
                    <AlertIcon color={'yellow.400'} boxSize='40px' mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                        Confirmez le paiement 
                    </AlertTitle>
                    <AlertDescription fontSize={'sm'} maxWidth='sm'>
                        Veuiller valider le paiement en tappant *126# ou #150*4*4#!
                        <br />
                        Avant la validation verifier que la note de paiement soit Bien <br /><br />
                        <strong style={{color: '#3f76ff'}}>{machineId === 'none' ? 'Recharge de Compte CtLab': 'Paiement de machine Ctlab'}</strong> <br />

                        montant de la transaction : <strong style={{color: '#3f76ff', fontSize:'15px'}}>{amount}</strong> XAF
                    </AlertDescription>
                </Alert>

                <Flex justify={'center'} mt={4}>
                    <Button size={'sm'} isLoading={isLoading} onClick={getStatus} fontWeight={'500'} colorScheme='yellow' >Verifier le paiement</Button>
                </Flex>

                {show && <Text fontSize={'xs'} fontWeight={600} color={'red.400'} position={'absolute'} bottom={10}>La transaction a échouée veuillez reéssayer...</Text>}
                
            </Box>
        </GridItem>
    </Grid>
  )
}

export default ValidatePayment
