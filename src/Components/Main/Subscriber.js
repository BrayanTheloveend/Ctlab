import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Subscriber = ({data}) => {
  return (
    <Flex justify={'space-between'} mt={2} gap={4} w={'100%'} pb={2} align={'center'} borderBottom={'1px'} borderColor={'gray.700'}>
        <Flex justify={'flex-start'} align={'center'} gap={2}>
            
            <Box>
                <Text noOfLines={1} color={'gray.400'}>{data?.name} {data?.surname}</Text>
                <Text noOfLines={1} mt={1} color={'gray.500'}>{data?.email}</Text>
            </Box>
        </Flex>

        <Box textAlign={'center'}>
            
            <Text color={'gray.400'}>Machines </Text>
            <Text fontWeight={'bold'} color={'gray.200'}> {data?.machine.length}</Text>
        </Box>

        <Box>
            <Text color={'gray.400'}>Solde </Text>
            <Text fontWeight={'bold'} color={'#3f76ff'}>{data?.solde} <small style={{fontWeight: 400, fontSize: '12px'}}>XAF</small></Text>
        </Box>
    </Flex>
  )
}

export default Subscriber
