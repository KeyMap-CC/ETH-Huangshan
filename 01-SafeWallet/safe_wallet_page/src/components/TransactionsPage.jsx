import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  useToast,
  Select,
  Textarea,
  InputGroup,
  InputRightAddon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';
import Navbar from './Navbar';
import { ethers } from 'ethers';

const TransactionsPage = () => {
  const { 
    isConnected, 
    connectWallet, 
    accounts, 
    createTransaction,
    chainId 
  } = useWeb3();
  
  const [fromAccount, setFromAccount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const toast = useToast();

  const handleConnect = async () => {
    await connectWallet();
  };

  const validateForm = () => {
    if (!fromAccount) {
      setError('Please select a source account');
      return false;
    }
    
    if (!toAddress) {
      setError('Please enter a recipient address');
      return false;
    }
    
    if (!ethers.utils.isAddress(toAddress)) {
      setError('Invalid recipient address');
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Format data field if empty
      const txData = data.trim() === '' ? '0x' : data;
      
      // Convert amount from ETH to wei
      const amountInWei = ethers.utils.parseEther(amount).toString();
      console.log(`Converting ${amount} ETH to ${amountInWei} wei`);
      
      // Create transaction using standard Ethereum methods
      const result = await createTransaction(toAddress, amountInWei, txData);
      
      if (result) {
        setSuccess('Transaction created successfully!');
        toast({
          title: "Transaction Created",
          description: "Your transaction has been created and is awaiting confirmation",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form
        setToAddress('');
        setAmount('');
        setData('');
      } else {
        setError('Failed to create transaction');
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      setError('Error creating transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkCurrency = () => {
    switch (chainId) {
      case 1:
      case 5:
      case 11155111:
        return 'ETH';
      case 137:
      case 80001:
        return 'MATIC';
      default:
        return 'ETH';
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <Box flex="1" p={6} bg="gray.50" overflowY="auto">
        <VStack spacing={6} align="stretch" maxW="800px" mx="auto">
          <Heading size="lg">New Transaction</Heading>
          
          {!isConnected ? (
            <Card variant="outline" p={6} textAlign="center">
              <VStack spacing={4}>
                <Heading size="md">Connect Your Wallet</Heading>
                <Text>Connect your wallet to create transactions</Text>
                <Button colorScheme="teal" onClick={handleConnect}>
                  Connect Wallet
                </Button>
              </VStack>
            </Card>
          ) : (
            <Card variant="outline">
              <CardHeader bg="teal.50" p={4}>
                <Heading size="md">Transaction Details</Heading>
              </CardHeader>
              
              <CardBody p={4}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    {error && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle mr={2}>Error!</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        <CloseButton 
                          position="absolute" 
                          right="8px" 
                          top="8px" 
                          onClick={() => setError('')}
                        />
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert status="success">
                        <AlertIcon />
                        <AlertDescription>{success}</AlertDescription>
                        <CloseButton 
                          position="absolute" 
                          right="8px" 
                          top="8px" 
                          onClick={() => setSuccess('')}
                        />
                      </Alert>
                    )}
                    
                    <FormControl isRequired>
                      <FormLabel>From Account</FormLabel>
                      <Select 
                        placeholder="Select account" 
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                      >
                        {accounts.map((account, index) => (
                          <option key={account} value={account}>
                            Account {index + 1} ({account.substring(0, 6)}...{account.substring(account.length - 4)})
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>To Address</FormLabel>
                      <Input 
                        placeholder="0x..." 
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Amount</FormLabel>
                      <InputGroup>
                        <Input 
                          type="number" 
                          step="0.000001"
                          placeholder="0.0" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <InputRightAddon children={getNetworkCurrency()} />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Data (Optional)</FormLabel>
                      <Textarea 
                        placeholder="0x..." 
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                      />
                    </FormControl>
                  </VStack>
                </form>
              </CardBody>
              
              <Divider />
              
              <CardFooter p={4}>
                <Flex width="100%" justify="flex-end">
                  <Button 
                    colorScheme="teal" 
                    onClick={handleSubmit}
                    isLoading={loading}
                    loadingText="Creating..."
                  >
                    Create Transaction
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default TransactionsPage;
