import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Image, Input, Radio, RadioGroup, Select, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import image1 from '../../assets/mtn.png'
import image2 from '../../assets/orange.png'
import { useNavigate, useParams } from 'react-router-dom'
import { requesttopay } from '../../MONETBILL/monetbill'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'


const DepositAndWithDraw = () => {

    const { state, machineId, amout } =useParams()
    const [isLoading, setIsLoading]=useState(false)
    const [show, setShow]=useState(false)

    const collectionRef = collection(db, "history");
    const navigate = useNavigate()
    const [validInput, setValidInput]=useState({
        mobile: '',
        montant: ''
    })
    const [payMethod, setPayMethod]=useState("MOMO")

    const savedData = JSON.parse(localStorage.getItem('userData'))
    const [payload, setPayload]=useState({
        montant: amout ? amout : null,
        mobile: savedData?.mobile,
        currency: 'XAF',
        country: 'CM'
    })

    const handleSubmitToMoMo = async()=>{
        console.log(payload)
        if(!payload.mobile){
            setValidInput({
                montant: false,
                mobile: true
            })
        }else if(!payload.montant){
            setValidInput({
                montant: true,
                mobile: false
            })
        }else{
            setValidInput({
                montant: false,
                mobile: false
            })
            setIsLoading(true)
            await requesttopay(payload.mobile, payload.montant, payload.country, payload.currency )
            .then(resp=>{
                if(machineId === 'none'){
                    setIsLoading(false)
                    navigate(`/AWaittingPamentValidation/nope/machine/none/amount/${payload.montant}`)
                    // console.log(resp)
                }else{
                    setIsLoading(false)
                    navigate(`/AWaittingPamentValidation/nope/machine/${machineId}/amount/${payload.montant}`)
                    // console.log(resp)
                }
            })
            .catch(err=> {
                console.log(err)
                setIsLoading(false)
            })
        }
        
    }


    const handleWithdraw = async ()=>{

        const datafetched = await getDoc(doc(db, "users", savedData?.userId))
        let result = datafetched.data()
        const userDoc = doc(db, "users", savedData?.userId)

        const add = await addDoc(collectionRef, {statut: true, design: 'Retrait de fonds', TimeStamp: new Date(), amount: parseInt(payload.montant)})

        const newFields = { allowWidthdraw: 0, history: [...result.history, add.id]  };
        await updateDoc(userDoc, newFields);

        alert('Votre demande de Retrait a bien été reçu vous percevrez les fonds dans 24h')
        setShow(false)
        setIsLoading(false)
        setTimeout(navigate, 1800, '/profile/history')
    }

    // useEffect(() => {
    //     setDisabled(true)
    //     generateMoMoToken()
    //     .then(resp=> {
    //         setToken(resp)
    //         setDisabled(false)
    //     })
    //     .catch(err=> {
    //         console.log(err)
    //         setDisabled(false)
    //     })
    // }, [])

    

  return (
    <>
        <Text color={'white'} textAlign={'center'} fontWeight={600}>Effectuer { state === 'withdrmig' ?  'un Retrait' : 'une Rechage'}</Text>

        <RadioGroup defaultValue='MOMO' display={'flex'} justifyContent={'center'} alignItems={'center'} mt={8} gap={6}>
            <Flex flexDir={'column'} gap={2} justify={'center'} align={'center'}>
                <Flex gap={4}>
                    <Radio value='MOMO' onChange={e => {
                        console.log(e.target.value)
                        setPayMethod(e.target.value)
                        }} />
                    <Image src={image1} mt={1}  rounded={4} w={10} />
                </Flex>
                <Text color={'gray.500'} fontSize={'sm'}>Mobile Money</Text>
            </Flex>

            <Flex flexDir={'column'} gap={2} justify={'center'} align={'center'}>
                <Flex gap={4}>
                    <Radio value='OM' onChange={e => setPayMethod(e.target.value)} />
                    <Image src={image2} rounded={4}  w={10}/>
                </Flex>
                <Text color={'gray.500'} fontSize={'sm'}>Orange Money</Text>
            </Flex>

        </RadioGroup>

        <FormControl mt={4}>
            <FormLabel color={'gray.500'} fontSize={'sm'}>
                Telephone
            </FormLabel>
            <Input type='number' onChange={e=>setPayload({...payload, mobile: e.target.value})} defaultValue={savedData?.mobile} value={payload.mobile}  maxLength={9} color={'gray.400'} placeholder='numero de telephone avec indentifiant national'/>
            { validInput.mobile && <FormHelperText color={'red.500'}>Ce champ est requis</FormHelperText>}
        </FormControl>
        
        <Flex gap={4}>
            <FormControl mt={4}>
                <FormLabel color={'gray.500'} fontSize={'sm'}>
                    Montant
                </FormLabel>
                <Input type='number' onChange={e=>setPayload({...payload, montant: e.target.value})} isDisabled={machineId !== "none"} value={ machineId !== "none" ? parseInt(amout) : payload.montant} color={'gray.400'} placeholder='Montant de la recharge'/>
                { validInput.montant && <FormHelperText color={'red.500'}>Ce champ est requis</FormHelperText>}
            </FormControl>

            <FormControl mt={4}>
                <FormLabel color={'gray.500'} fontSize={'sm'}>
                    Devise
                </FormLabel>

                <Select 
                    value={payload.country}
                    color={'gray.400'}
                    onChange={e=> setPayload({...payload, currency: e.target.options[e.target.options.selectedIndex].id.slice(0, 3), country:e.target.value })}
                >
                    <option id={'XAFCM'} value='CAMEROUN'>CAMEROUN</option>
                    <option id={'XOFSN'} value='SENEGAL'>SENEGAL</option>
                    <option id={'CDFCD'} value='CONGO KIN'>CONGO KIN</option>
                    <option id={'LRDLR'} value='LIBERIA'>LIBERIA</option>
                    <option id={'UGXUG'} value='UGANDA'>UGANDA</option>
                    <option id={'XAFCG'} value='CONGO BRA'>CONGO BRA</option>
                    <option id={'XOFBJ'} value='BENIN'>BENIN</option>
                    <option id={'GNFGN'} value='GUINE COM'>GUINE CON</option>
                    
                </Select>
            </FormControl>
        </Flex>
        



        <Button 
            mt={10}
            w={'100%'}
            fontWeight={400}
            isLoading={isLoading} 
            // bg={vert} 
            // onClick={handleSubmit}
            bg={'#3f76ff'} 
            colorScheme={'blue'} variant={'solid'}
            onClick={state === 'withdrmig' ? handleWithdraw : handleSubmitToMoMo}
            >
           { state === 'withdrmig' ?  'Retirer' : 'Rechager'}
        </Button>


      
    </>
  )
}

export default DepositAndWithDraw
