import React, { useState } from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'


const MachineItems = ({data}) => {

    const navigate = useNavigate()
    const [isLoading, setIsLoading] =useState(false)
    const savedData = JSON.parse(localStorage.getItem('userData'))
    const collectionRef = collection(db, "history");

    const handleUpdateAccount = async()=>{
        setIsLoading(true)
        const datafetched = await getDoc(doc(db, "users", savedData?.userId))
        let result = datafetched.data()
        console.log(result)
        const userDoc = doc(db, "users", savedData?.userId);

        if(result?.solde > parseInt(data?.price)){

            const add = await addDoc(collectionRef, {statut: false, design: 'Achat machine', TimeStamp: new Date(), amount: parseInt(data?.price)})
            const newFields = { solde: parseInt(result?.solde) - parseInt(data?.price), machine: [ ...result.machine, data?.id], TimeStamp : new Date(), history: [...result?.history ,add.id]  };
            await updateDoc(userDoc, newFields);
            setIsLoading(false)
            navigate('/profile/Account')
        }else{
            navigate(`/transWidthRem/noreply/machine/${data?.id}/amout/${data?.price}`)
        }
       
    }

  return (
    <Box mb={4} bg={'gray.700'} p={4} rounded={8}>
      <Flex justify={'space-between'} align={'center'}>
                <Flex gap={4}>
                    <Image src={data?.attachement} w={'30px'} rounded={'full'}/>
                    <Text>{data?.label}</Text>
                </Flex>

                <Text fontSize={'sm'} color={'gray.400'}> { !data?.paid ? 'Prix :' : 'disponible'} <strong style={{color: data?.paid && "#34cd34"}}>{!data?.paid && data?.price}</strong><small style={{fontWeight: 400, color: data?.paid && "#34cd34",  fontSize: '12px'}}> {!data?.paid && 'XAF'}</small></Text>
            </Flex>

            <Flex justify={'space-between'} mt={4} align={'center'}>
                <Box>
                    <Text color={'gray.400'} fontSize={'xs'}>Profit par jour</Text>
                    <Text color={'#3f76ff'}> {data?.earnPerDay} <small style={{fontWeight: 400, fontSize: '12px'}}>XAF</small></Text>
                </Box>

                <Box>
                    <Text color={'gray.400'} fontSize={'xs'}> { !data?.paid ? 'Durée' : 'Durée restante'} </Text>
                    <Text color={'#3f76ff'}>{data?.duration} jours</Text>
                </Box>

                { !data?.paid ? <Button 
                size={'sm'} 
                isLoading = {isLoading}
                fontWeight={400} 
                colorScheme='green'
                //onClick={()=> userCurrentData?.solde > parseInt(data?.price) ?  navigate(`/transWidthRem/noreply/machine/${data?.id}/amout/${data?.price}`) : handleUpdateAccount } >
                onClick={handleUpdateAccount} 
                >
                    Acheter
                </Button>
                : <Box>
                    <Text fontSize={'xs'} fontWeight={600} color={'green.400'}>en cours d'utilisation</Text>
                    <Text fontSize={'xs'} fontWeight={400} color={'gray.400'}>retrait chaque : {data?.withdrawDay} jours</Text>
                </Box>
            }


            </Flex>
    </Box>
  )
}

export default MachineItems
