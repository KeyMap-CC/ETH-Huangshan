import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  FormControl,
  FormLabel,
  Switch,
  Select,
  useToast,
  RadioGroup,
  Radio,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';
import Navbar from './Navbar';

const SettingsPage = () => {
  const { 
    isConnected, 
    connectWallet, 
    chainId,
    switchChain,
    snapInstalled
  } = useWeb3();
  
  const [selectedChain, setSelectedChain] = useState(chainId?.toString() || '1');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const toast = useToast();

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleChainChange = async (chainId) => {
    setSelectedChain(chainId);
    const success = await switchChain(parseInt(chainId));
    
    if (success) {
      toast({
        title: "Network Changed",
        description: "Successfully switched to the selected network",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to switch network",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSaveSettings = () => {
    // Save settings to local storage
    localStorage.setItem('safeWallet_theme', theme);
    localStorage.setItem('safeWallet_notifications', notifications.toString());
    
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <Box flex="1" p={6} bg="gray.50" overflowY="auto">
        <VStack spacing={6} align="stretch" maxW="800px" mx="auto">
          <Heading size="lg">Settings</Heading>
          
          {!isConnected ? (
            <Card variant="outline" p={6} textAlign="center">
              <VStack spacing={4}>
                <Heading size="md">Connect Your Wallet</Heading>
                <Text>Connect your wallet to access settings</Text>
                <Button colorScheme="teal" onClick={handleConnect}>
                  Connect Wallet
                </Button>
              </VStack>
            </Card>
          ) : (
            <>
              {savedSuccess && (
                <Alert status="success" mb={4}>
                  <AlertIcon />
                  <AlertTitle mr={2}>Success!</AlertTitle>
                  <AlertDescription>Your settings have been saved.</AlertDescription>
                </Alert>
              )}
              
              <Card variant="outline" mb={6}>
                <CardHeader bg="teal.50" p={4}>
                  <Heading size="md">Network Settings</Heading>
                </CardHeader>
                
                <CardBody p={4}>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Select Network</FormLabel>
                      <Select 
                        value={selectedChain} 
                        onChange={(e) => handleChainChange(e.target.value)}
                      >
                        <option value="1">Ethereum Mainnet</option>
                        <option value="5">Goerli Testnet</option>
                        <option value="11155111">Sepolia Testnet</option>
                        <option value="137">Polygon Mainnet</option>
                        <option value="80001">Mumbai Testnet</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card variant="outline" mb={6}>
                <CardHeader bg="teal.50" p={4}>
                  <Heading size="md">MetaMask Snap</Heading>
                </CardHeader>
                
                <CardBody p={4}>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Text>Safe Wallet Snap</Text>
                      <Flex align="center">
                        <Text mr={2} color={snapInstalled ? "green.500" : "red.500"}>
                          {snapInstalled ? "Installed" : "Not Installed"}
                        </Text>
                        {!snapInstalled && (
                          <Button size="sm" colorScheme="teal" onClick={connectWallet}>
                            Install
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                    
                    <Divider />
                    
                    <Text fontSize="sm" color="gray.600">
                      The Safe Wallet Snap extends MetaMask functionality to support Safe accounts and transactions.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default SettingsPage;
