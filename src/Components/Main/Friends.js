import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../Firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import CustomLoading from '../Custom/CustomLoading';
import image from '../../assets/no-data-empty.png'
import { FiArrowLeft } from 'react-icons/fi';
import Subscriber from './Subscriber';


const Friends = () => {
    const savedData = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()

    useEffect(() => {
        if(!savedData){
            navigate('/regis')
        }
    }, [navigate, savedData]);


    const [isLoading, setIsLoading] = useState(true)
    const [friend, setFriend] = useState([])

    useEffect(() => {
        const getFriends = async () => {
          await getDoc(doc(db, "users", savedData ? savedData?.userId : '0'))
          .then(async response=>{

            let arrayOfMachines = []
            let temp = response.data()?.friends
            
            if(temp.length !== 0){

                for(let elt of temp){
                    await getDoc(doc(db, "users", elt))
                     .then(resp => {
                         console.log(resp.data())
                         arrayOfMachines.push(resp.data())
                     })
                }
                 setFriend(arrayOfMachines)
                 setIsLoading(false)
                        
             }else{
                setFriend([])
                setIsLoading(false)
             }

        }).catch(err=> console.log(err))}
          
        getFriends()

        
      }, []);

      const Empty = <Flex mt={20}  flexDir={'column'} justify={'center'} align={'center'}>
        <Image src={image} w={28}/>
        <Text textAlign={'center'} fontSize={'xs'} color={'gray.500'}>Vous n'avez aucune machine .</Text>

      </Flex>
  return (
    <Box fontSize={'sm'} color={'white'}>
        <Flex gap={2} align={'center'}>
            <IconButton colorScheme='blue' onClick={()=>navigate('/profile/Account')} bg={'#3f76ff'} size={'xs'} icon={<FiArrowLeft size={'13px'}/>}/>
            <Text fontSize={'md'}>Vos Amis</Text>
        </Flex>
        <Text fontSize={'xs'} mt={2} color={'gray.500'}>Voici la liste de vos Amis Invitées. <br />
        Lorsque vous invitez des amis il s'affiche ici .
        </Text>
        <Text mt={2} fontSize={'xs'} color={'gray.300'}>Code de parrainage &nbsp; <span style={{color:'white', fontWeight: 500}}>{savedData?.codeparrain}</span></Text>

        <Box mt={6} fontSize={'xs'}>

        { isLoading ? <CustomLoading/> : friend?.length === 0 ?  Empty : friend?.map((elt, index)=> <Subscriber key={index} data={elt}/>) }
           
          
        { !isLoading && <Text textAlign={'center'} mt={8} fontSize={'xs'} color={'gray.400'}>Votre profit de parrainage total <br /> <span style={{color: '#3f76ff', fontWeight: 600, fontSize: '16px' }}>{friend?.length * 600} </span>XAF</Text>}
        </Box>
    </Box>
  )
}

export default Friends
