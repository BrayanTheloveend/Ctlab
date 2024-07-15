import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Grid, Link, GridItem, Icon, Skeleton, Text } from '@chakra-ui/react'
import { BiSolidCalendar, BiSolidUser } from 'react-icons/bi'
import { FiBookmark, FiSearch, FiShoppingCart, FiUserPlus } from 'react-icons/fi'
import { NavLink, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../Firebase/Firebase'
import { setupInterval } from '../../theme'


const Profile = () => {

    const savedData = JSON.parse(localStorage.getItem('userData'))
    const savedTotalEarn = localStorage.getItem('totalEarn')
    const navigate = useNavigate()
    // const collectionRef = collection(db, "users");
    // const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(!savedData){
            navigate('/regis')
        }
    }, [navigate, savedData]);


    const [isLoading, setIsLoading] = useState(true)
    const [earn, setEarn] = useState(null)
    const [users, setUsers] = useState({})
    const [highestMachine, setHighestMachine] = useState()

    //update amout after 24 hrs
  
    setupInterval(async()=>{
        const data = await getDoc(doc(db, "users", savedData?.userId))
        const fetchDated = data.data()
        const userDoc = doc(db, "users", savedData?.userId);
        let newMachines = []
        let newFields = {}

        if(fetchDated?.machine?.length > 0){
            for (let elt of fetchDated?.machine){
                await getDoc(doc(db, "machine", elt))
                .then(resp => {
                    console.log(elt)
                    newMachines = [...newMachines, {...resp.data(), duration: resp.data()?.duration - 1 }]
                    console.log(newMachines)
                })
                
            }

        }
        newFields = { solde: parseInt(savedTotalEarn) + parseInt(fetchDated?.solde), allowWidthdraw: fetchDated?.allowWidthdraw + 1};

        await updateDoc(userDoc, newFields);
    }, 86400000)

    useEffect(() => {
        const getUsers = async () => {
          await getDoc(doc(db, "users", savedData ? savedData?.userId : '0'))
          .then(async response=>{
            setUsers(response.data())
            let earnPerDay = 0
            let arrayOfMachine = []
            let machine = response.data()?.machine

            if(machine.length !== 0){

                for(let elt of machine){
                    await getDoc(doc(db, "machine", elt))
                     .then(resp => {
                         earnPerDay += resp.data()?.earnPerDay ;
                         arrayOfMachine = [...arrayOfMachine, resp.data()]
                         console.log(arrayOfMachine)
                     })
                }
                 setEarn(earnPerDay)
                 setHighestMachine(arrayOfMachine.slice(-1))
                 localStorage.setItem('totalEarn', earnPerDay + (response.data()?.friends.length * 600))
                 setIsLoading(false)
                        
             }else{
                 setEarn(0)
                 setIsLoading(false)
             }

        }).catch(err=> console.log(err))
        }
          
        getUsers()

      }, []);

      const logOut =()=>{
        auth.signOut()
        localStorage.setItem('userData', undefined)
        navigate('/regis')
      }

  return (
    <Box>
        
        <Flex mt={4} justify={'space-between'} align={'center'}>
            <Box>
                <Text  color={'white'} fontSize={'sm'}>
                    {savedData?.name} {savedData?.surname}
                </Text>
                <Text fontSize={'xs'} color={'gray.400'}>
                {savedData?.email}
                </Text>
            </Box>

            <Box fontSize={'xs'} onClick={logOut} cursor={'pointer'} display={'flex'}alignItems={'center'} justifyContent={'center'} gap={2} color={'red.400'}>
                Se deconnecter
            </Box>
        </Flex>
        
        

        <Box display={'flex'} mt={4} justifyContent={'space-between'} boxShadow={'0 0 8px rgba(0, 0, 0, 0.3)'} color={'white'} rounded={12} w={'100%'} p={4} bg={'#3f76ff'}>
            <Box>
                <Text fontSize={'sm'}>
                    Solde du compte
                </Text>
                <Text mt={1} fontSize={'xl'}  fontWeight={700}>
                {users?.solde} <small style={{fontWeight: 400, fontSize: '12px'}}>XAF</small>
                </Text>
            
            </Box>

            <Box>
               <Flex gap={1} justifyContent={'end'}>
                    <Button fontSize={'sm'} fontWeight={500} colorScheme='gray' color={'green.400'}  size={'sm'} onClick={()=>navigate('/transWidthRem/noreply/machine/none/amout/2000')}>Recharge</Button>
                    <Button isDisabled={isLoading ? isLoading :  !(users?.allowWidthdraw > (highestMachine[0]?.withdrawDay + 1)) } fontSize={'sm'} fontWeight={500} colorScheme='gray' color={'red.400'} size={'sm'} onClick={()=>navigate('/transWidthRem/withdrmig/machine/none/amout/2000')}>Retrait</Button>
                </Flex> 

                { earn !== 0 && !isLoading && <Text mt={2} fontSize={'xs'}>retrait disponible dans {(highestMachine[0]?.withdrawDay - users?.allowWidthdraw) < 0 ? 0 : highestMachine[0]?.withdrawDay - users?.allowWidthdraw} jours </Text>}
            </Box>
            
            
        </Box>
        

            <Flex mt={4} color={'gray.400'} justify={'space-between'} align={'center'}>
                <Box>
                    <Text fontSize={'xs'}>Profit par jour</Text>

                    <Skeleton isLoaded={!isLoading}>
                        <Flex mt={2} gap={2}>
                            <Icon as={BiSolidCalendar} color={'#3f76ff'} />
                            <Text fontSize={'sm'} color={'white'} fontWeight={500}> {earn} <small style={{fontWeight: 400, fontSize: '12px'}}>XAF</small></Text>
                        </Flex>  
                    </Skeleton>
                    
                </Box>

                <Box>
                    <Text fontSize={'xs'}>Profit de parrainge</Text>
                
                    <Skeleton isLoaded={!isLoading}>
                        <Flex mt={2} gap={2}>
                            <Icon as={BiSolidUser} color={'#3f76ff'} />
                            <Text fontSize={'sm'} color={'white'} fontWeight={500}>{600 * users?.friends?.length} <small style={{fontWeight: 400, fontSize: '12px'}}>XAF</small></Text>
                        </Flex>
                    </Skeleton>
                    
                    
                </Box>
                
            </Flex>



        <Grid gap={6} mt={6} gridTemplateColumns={{base: '1fr 1fr', md:'200px 200px'}}>
            <GridItem>
                
                <Link as={ NavLink} color={'white'} to={'/profile/history'} display={'flex'} _hover={{ color: '#3f76ff', bg: 'gray.600', fontWeight: 500 }} gap={4} flexDir={'column'} justifyContent={'center'} p={4} alignItems={'center'} rounded={8} bg={'gray.700'}>
                    <Icon w={'30px'} color={'#3f76ff'} h={'30px'} as={FiBookmark} />
                    <Text fontSize={'xs'}>Historiques</Text>
                </Link>
                
                
            </GridItem>

            <GridItem>
                
                <Link as={ NavLink} color={'white'} to={'/profile/friends'} display={'flex'} _hover={{ color: '#3f76ff', bg: 'gray.600', fontWeight: 500 }} gap={4} flexDir={'column'} justifyContent={'center'} p={4} alignItems={'center'} rounded={8} bg={'gray.700'}>
                    <Icon w={'30px'} color={'#3f76ff'} h={'30px'} as={FiUserPlus} />
                    <Text fontSize={'xs'}>Inviter des amies</Text>
                </Link>
                
                
            </GridItem>

            <GridItem>
                
                <Link as={ NavLink} color={'white'} to={'/profile/machines'} display={'flex'} gap={4} _hover={{ color: '#3f76ff', bg: 'gray.600', fontWeight: 500 }} flexDir={'column'} justifyContent={'center'} p={4} alignItems={'center'} rounded={8} bg={'gray.700'}>
                    <Icon w={'30px'} color={'#3f76ff'} h={'30px'} as={FiShoppingCart} />
                    <Text fontSize={'xs'}> Mes Machines </Text>
                </Link>
                
                
            </GridItem>
            <GridItem>
                <Link fontSize={'xs'} _hover={{ color: '#3f76ff', bg: 'gray.600', fontWeight: 500 }} color={'white'} onClick={()=>alert('Contactez-nous via whatssap au numero ☎️ +91 94254 28082')} as={ NavLink}  display={'flex'}  gap={4} flexDir={'column'} justifyContent={'center'} p={4} alignItems={'center'} rounded={8} bg={'gray.700'}>
                    <Icon w={'30px'} color={'#3f76ff'} h={'30px'} as={FiSearch} />
                    <Text>Service Client</Text>
                </Link>
            </GridItem>
        </Grid>

        

        {/* <Flex align={'center'} mt={4} color={'gray.500'} justify={'space-between'}>
            <Text fontSize={'sm'} mt={4} fontWeight={400}>Participants</Text>
            <Text fontSize={'sm'} mt={4} fontWeight={400}>Machine &nbsp;</Text>
            <Text fontSize={'xs'} mt={4} fontWeight={400}>&nbsp; Gains</Text>
        </Flex>

        <Box fontSize={'xs'} color={'gray.600'} mt={4}>
            <Subscriber/>
            <Subscriber/>
            <Subscriber/>
            <Subscriber/>
        </Box> */}

    </Box>
  )
}

export default Profile
