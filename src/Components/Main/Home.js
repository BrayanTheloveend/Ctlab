import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Subscriber from './Subscriber'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import { kFormatter } from '../../theme'


const Home = () => {


    const [isLoading, setIsLoading] = useState(true)
    const [isLoading1, setIsLoading1] = useState(true)
    const [machine, setMachine] = useState([])
    const [users, setUsers] = useState([])
    const collectionRef = collection(db, "machine")
    const savedData = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()

    useEffect(() => {

        const q = query(collectionRef);

        const getMachines = async () => {
          await onSnapshot(q, (QuerySnapshot)=>{
            let channels = [];
            QuerySnapshot.forEach(async(doc)=> {
                
                channels.push({...doc.data(), id: doc.id});
             });
             setMachine(channels.sort((a,b)=> a.price - b.price));
             setIsLoading(false)
          })
          
        }
    
        getMachines();
        
      }, []);

    useEffect(() => {

        const q = query(collection(db, 'users'));

        const getUsers = async () => {
          await onSnapshot(q, (QuerySnapshot)=>{
            let channels = [];
            QuerySnapshot.forEach(async(doc)=> {
                
                channels.push({...doc.data(), id: doc.id});
             });
             setUsers(channels);
             setIsLoading1(false)
          })
          
        }
    
        getUsers();
        
      }, []);

      useEffect(() => {
        if(!savedData){
            navigate('/regis')
        }
    }, [navigate, savedData]);

  return (
    <Box>
      <Text color={'white'} fontSize={'md'} fontWeight={'600'}>Bienvenue a vous Chérs pionniers</Text>
      <Text color={'gray.500'} mt={1} fontSize={'sm'}>
        Nous sommes content de vous rencontrez et nous espérons que vous poussiez béneficié de notre services.
      </Text>


      <Text color={'#3f76ff'} textAlign={'center'} fontWeight={500} mt={8} fontSize={'sm'}>
        Informations utiles
      </Text>

      <Box mt={4}>
        <Flex w={10} justify={'center'} align={'center'} rounded={'full'} bg={"#3f76ff"} h={10}>
            <Text fontSize={'xl'} color={'white'}>1</Text>
        </Flex>

        <Text mt={1} fontSize={'xs'} color={'gray.500'}> 
            Aprés vous etre inscrits Acheter une machine de votre choix selon votre budget ou selon le profit que vous souhiater obtenir.  
        </Text>
      </Box>

      <Box mt={4}>
        <Flex w={10} justify={'center'} align={'center'} rounded={'full'} bg={"#3f76ff"} h={10}>
            <Text fontSize={'xl'} color={'white'}>2</Text>
        </Flex>

        <Text mt={1} fontSize={'xs'} color={'gray.500'}> 
            Le profit est proportionnelle au niveau de votre machine et aux nombres d'amies invités notament 
            <strong style={{ color: '#3f76ff'}}> 600 </strong> XAF pour chaque amies ajouter.  
        </Text>
      </Box>

      <Box mt={4}>
        <Flex w={10} justify={'center'} align={'center'} rounded={'full'} bg={"#3f76ff"} h={10}>
            <Text fontSize={'xl'} color={'white'}>3</Text>
        </Flex>

        <Text mt={1} fontSize={'xs'} color={'gray.500'}> 
          Les Retraits sont conditionnée par les delais suivant apartir de la date d'achat des la machine selon cette liste :
        </Text>
          <Flex mt={4} fontSize={'xs'} flexDir={'column'} color={'gray.400'}>
          { isLoading ? <span fontSize={'xs'}>Chargement...</span> :  machine.map((elt, index)=><Flex mt={2} justify={'space-between'} key={elt.id} style={{fontWeight: 400, color: '#ccc'}}>
              <Flex  gap={2}>
                <Image src={elt?.attachement} w={'30px'} rounded={'full'} />
                <Text>Machine {elt.label}</Text>
              </Flex>
               

              <Text>chaque {elt.withdrawDay} jours</Text>
             </Flex>  ) }
          </Flex>

        
      </Box>

        <Flex justify={'space-between'} mt={8} align={'center'}>
            <Text color={'white'} fontWeight={300} fontSize={'sm'}>
              Nombres de Participants
            </Text>

            <Text color={'gray.400'} fontSize={'sm'}> {kFormatter(users.length)} </Text>
        </Flex>
      

      {/* <Flex align={'center'} mt={2} color={'gray.500'} justify={'space-between'}>
            <Text fontSize={'sm'} mt={4} fontWeight={400}>Users &nbsp;</Text>
            <Text fontSize={'sm'} mt={4} fontWeight={400}> &nbsp;Machine </Text>
            <Text fontSize={'sm'} mt={4} fontWeight={400}>&nbsp; Profit</Text>
        </Flex> */}

        <Box fontSize={'xs'} color={'gray.600'} mt={6}>
            {/* <Subscriber/>
            <Subscriber/>
            <Subscriber/>
            <Subscriber/> */}
        </Box>

    </Box>
  )
}

export default Home
