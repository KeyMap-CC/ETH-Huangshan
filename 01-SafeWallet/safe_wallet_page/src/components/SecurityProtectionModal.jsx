import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Box,
  Badge,
  useToast
} from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';


const SecurityProtectionModal = ({ isOpen, onClose }) => {
  const { isProtected, setIsProtected, payProtection } = useWeb3();
  const toast = useToast();

  const handlePurchaseProtection = async () => {
    if(isProtected) {
      toast({
        title: 'Already Protected',
        description: 'You are already protected.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }
    
    try {
      // Send transaction
      const result = await payProtection();
      
      if (result) {
        // Set protection status to true
        setIsProtected(true);
        
        toast({
          title: 'Protection Service Purchased',
          description: 'Your transaction has been submitted. You will be protected once the transaction is confirmed.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        onClose();
      }
    } catch (error) {
      console.error('Error purchasing protection:', error);
      toast({
        title: 'Transaction Failed',
        description: error.message || 'Failed to purchase protection service',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="350px">
        <ModalHeader>
          <HStack>
            <Text>Security Protection Service</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="teal.200"
              bg="teal.50"
            >
              <VStack align="center" spacing={3}>
                <Image
                  src="https://img.icons8.com/?size=100&id=QhA10OYH3JMI&format=png&color=319795"
                  alt="Security Shield"
                  width="60px"
                  height="60px"
                />
                <Text fontWeight="bold" fontSize="lg">Transaction Protection</Text>
                <Text textAlign="center">
                  Protect your transaction against smart contract vulnerabilities, 
                  scams, and other blockchain risks.
                </Text>
                <HStack justify="center">
                  <Text fontWeight="bold" fontSize="xl" color="teal.500">150 USDT</Text>
                </HStack>
              </VStack>
            </Box>
            
            <Box p={3} borderWidth="1px" borderRadius="md">
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">Benefits:</Text>
                <HStack fontSize="14px">
                  <Text>✓</Text>
                  <Text>Smart contract vulnerability protection</Text>
                </HStack>
                <HStack fontSize="14px">
                  <Text>✓</Text>
                  <Text>Scam & phishing protection</Text>
                </HStack>
                <HStack fontSize="14px">
                  <Text>✓</Text>
                  <Text>Transaction reversal assistance</Text>
                </HStack>
                <HStack fontSize="14px">
                  <Text>✓</Text>
                  <Text>24/7 security monitoring</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="teal" 
            onClick={handlePurchaseProtection}
          >
            Purchase Protection
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SecurityProtectionModal;
