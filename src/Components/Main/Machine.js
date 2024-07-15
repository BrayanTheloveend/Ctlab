import { Box, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MachineItems from './MachineItems'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import CustomLoading from '../Custom/CustomLoading'
import { useNavigate } from 'react-router-dom'


const Machine = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [machine, setMachine] = useState([])
    const collectionRef = collection(db, "machine")
    const savedData = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()


    
    useEffect(() => {
        if(!savedData){
            navigate('/regis')
        }
    }, [navigate, savedData]);


    useEffect(() => {

        const q = query(collectionRef);


        const getMachines = async () => {
          await onSnapshot(q, (QuerySnapshot)=>{
            let channels = [];
            QuerySnapshot.forEach((doc)=> {
                channels.push({...doc.data(), id: doc.id});
             });
             setMachine(channels.sort((a,b)=> a.price - b.price));
             setIsLoading(false)

          })
          
        }
    
        getMachines();
        
      }, []);

  return (
    <Box fontSize={'sm'} color={'white'}>
        <Text fontSize={'md'}>Nos Machines</Text>
        <Text fontSize={'xs'} mt={1} color={'gray.500'}>Acheter une machine pour miner et commencez a multiplier vos revenus.</Text>

       
        <Box mt={4}>
           
           { isLoading ? <CustomLoading/> :  machine?.map((elt, index)=> <MachineItems key={index} data={elt}/>) }

          
        </Box>

        
    </Box>
  )
}

export default Machine
