import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useToast,
  Code
} from '@chakra-ui/react';
import contractService from '../api/contractService';

/**
 * Component for scanning smart contracts for security vulnerabilities
 * 
 * @returns {JSX.Element} Contract scanner component
 */
const ContractScanner = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [contractCode, setContractCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  /**
   * Handle form submission to scan contract
   */
  const handleScanContract = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!contractAddress.trim()) {
      toast({
        title: 'Address Required',
        description: 'Please enter a contract address',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setScanResult(null);
      
      const result = await contractService.scanContract(contractAddress, contractCode);
      
      setScanResult(result);
      toast({
        title: 'Scan Complete',
        description: 'Contract scan completed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message || 'Failed to scan contract');
      toast({
        title: 'Scan Failed',
        description: err.message || 'An error occurred while scanning the contract',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Contract Security Scanner</Heading>
        <Text>Scan smart contracts for potential security vulnerabilities before interacting with them.</Text>
        
        <form onSubmit={handleScanContract}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Contract Address</FormLabel>
              <Input
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Contract Source Code (Optional)</FormLabel>
              <Textarea
                placeholder="Contract source code for more detailed analysis..."
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                minHeight="200px"
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="teal" 
              isLoading={isLoading}
              loadingText="Scanning"
            >
              Scan Contract
            </Button>
          </VStack>
        </form>
        
        {isLoading && (
          <Box textAlign="center" py={4}>
            <Spinner size="xl" />
            <Text mt={2}>Scanning contract for vulnerabilities...</Text>
          </Box>
        )}
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Scan Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {scanResult && (
          <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
            <Heading size="sm" mb={2}>Scan Results</Heading>
            <Code p={2} width="100%" overflowX="auto" display="block">
              {JSON.stringify(scanResult, null, 2)}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ContractScanner;
