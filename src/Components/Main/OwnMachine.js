import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../Firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import CustomLoading from '../Custom/CustomLoading';
import MachineItems from './MachineItems';
import image from '../../assets/no-data-empty.png'
import { FiArrowLeft } from 'react-icons/fi';

const OwnMachine = () => {

    const savedData = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()

    useEffect(() => {
        if(!savedData){
            navigate('/regis')
        }
    }, [navigate, savedData]);


    const [isLoading, setIsLoading] = useState(true)
    const [machine, setMachine] = useState([])

    useEffect(() => {
        const getMachines = async () => {
          await getDoc(doc(db, "users", savedData ? savedData?.userId : '0'))
          .then(async response=>{
            
            let arrayOfMachines = []
            let temp = response.data()?.machine
            
            if(temp?.length !== 0){

                for(let elt of temp){
                    await getDoc(doc(db, "machine", elt))
                     .then(resp => {
                         console.log(resp.data())
                         arrayOfMachines.push({...resp.data(), paid: true})
                     })
                }
                 setMachine(arrayOfMachines)
                 setIsLoading(false)
                        
             }else{
                setMachine([])
                setIsLoading(false)
             }

        }).catch(err=> console.log(err))}
          
        getMachines()

        
      }, []);

      const Empty = <Flex mt={20}  flexDir={'column'} justify={'center'} align={'center'}>
        <Image src={image} w={28}/>
        <Text textAlign={'center'} fontSize={'xs'} color={'gray.500'}>Vous n'avez aucune machine .</Text>

      </Flex>

  return (
    <Box fontSize={'sm'} color={'white'}>
        <Flex gap={2} align={'center'}>
            <IconButton colorScheme='blue' onClick={()=>navigate('/profile/Account')} bg={'#3f76ff'} size={'xs'} icon={<FiArrowLeft size={'13px'}/>}/>
            <Text fontSize={'md'}>Mes Machines</Text>
        </Flex>
        <Text fontSize={'xs'} mt={2} mb={6} color={'gray.500'}>Voici la liste de vos machines achétées. <br />
        Lorsque le delai durée d'exploitation d'une machine est expirée elle reste hors service jusqu'au prochain renouvellement.
        </Text>

        { machine.length !== 0 && <Flex justify={'center'} mt={6} my={2}>
          <Text fontSize={'xs'} color={'gray.300'}>Profil Total  &nbsp; &nbsp; <strong style={{color: '#3f76ff', fontSize: '15px'}}>{ !isLoading && machine.reduce((accumulator, currentValue) => accumulator + currentValue?.earnPerDay, 0) }</strong> XAF </Text>
        </Flex>}
        
        <Box mt={4}>

        { isLoading ? <CustomLoading/> : machine.length === 0 ?  Empty: machine?.map((elt, index)=> <MachineItems key={index} data={elt}/>) }
           
          
        </Box>
    </Box>
  )
}

export default OwnMachine
