import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../Firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import CustomLoading from '../Custom/CustomLoading';
import image from '../../assets/no-data-empty.png'
import { FiArrowLeft } from 'react-icons/fi';
import Subscriber from './Subscriber';
import { isElementType } from '@testing-library/user-event/dist/utils';
import dayjs from 'dayjs';


const History = () => {
    const savedData = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()

    useEffect(() => {
        if(!savedData){
            navigate('/regis')
        }
    }, [navigate, savedData]);


    const [isLoading, setIsLoading] = useState(true)
    const [history, setHistory] = useState([])

    useEffect(() => {
        const getHistory = async () => {
          await getDoc(doc(db, "users", savedData ? savedData?.userId : '0'))
          .then(async response=>{

            let arrayOfMachines = []
            let temp = response.data()?.history
            
            if(temp?.length !== 0){

                for(let elt of temp){
                    await getDoc(doc(db, "history", elt))
                     .then(resp => {
                         console.log(resp.data())
                         arrayOfMachines.push(resp.data())
                     })
                }
                 setHistory(arrayOfMachines)
                 setIsLoading(false)
                        
             }else{
                setHistory([])
                setIsLoading(false)
             }

        }).catch(err=> console.log(err))}
          
        getHistory()

        
      }, []);

      const Empty = <Flex mt={20}  flexDir={'column'} justify={'center'} align={'center'}>
        <Image src={image} w={28}/>
        <Text textAlign={'center'} fontSize={'xs'} color={'gray.500'}>Historique Vide.</Text>

      </Flex>
  return (
    <Box fontSize={'sm'} color={'white'}>
        <Flex gap={2} align={'center'}>
            <IconButton colorScheme='blue' onClick={()=>navigate('/profile/Account')} bg={'#3f76ff'} size={'xs'} icon={<FiArrowLeft size={'13px'}/>}/>
            <Text fontSize={'md'}>Historique</Text>
        </Flex>
        <Text fontSize={'xs'} mt={2} color={'gray.500'}>Voici l'historique des Transaction que vous avez éffectuer </Text>
        <Box mt={6} fontSize={'xs'}>

        { isLoading ? <CustomLoading/> : history?.length === 0 ?  Empty : history?.map((elt, index)=>{

            return(
                <Flex key={index} justify={'space-between'} mt={2} gap={4} w={'100%'} pb={2} align={'center'} borderBottom={'1px'} borderColor={'gray.700'}>
                    <Flex justify={'flex-start'} align={'center'} gap={2}>
                        <Box>
                            <Text noOfLines={1} color={'gray.400'}>Motif</Text>
                            <Text noOfLines={1} mt={1} color={'gray.500'}>{elt?.design}</Text>
                        </Box>
                    </Flex>

                        <Box textAlign={'center'}>
                            
                            <Text color={'gray.400'}>Montant</Text>
                            <Text fontWeight={'bold'} color={'#3f76ff'} > {elt?.amount} <small style={{fontWeight: 400, fontSize: '12px'}}>XAF</small></Text>
                        </Box>

                        <Box textAlign={'center'}>
                            
                            <Text color={'gray.400'}>statut</Text>
                            <Text fontWeight={'bold'} color={ elt?.statut ? 'green.400' : 'gray.500'} > {elt?.statut ? 'en cours' : 'terminée'} </Text>
                        </Box>

                        <Box>
                            <Text color={'gray.400'}>Date </Text>
                            <Text fontWeight={'bold'} color={'gray.200'}>{dayjs(elt?.date?.seconde).format('DD.MM.YYYY')} </Text>
                        </Box>
                </Flex>
            )
        }) }
           
          
        </Box>


        {!isLoading && history?.filter(elt=> elt.design === 'Retrait de fonds').length > 0 && <Text fontSize={'xs'} fontWeight={500} opacity={0.5} color={'yellow.400'} mt={8}>La durée de reception de fonds n'exécedera pas 24 heures <br />en cas de non reception contactez le service client.</Text>}
    </Box>
  )
}

export default History
