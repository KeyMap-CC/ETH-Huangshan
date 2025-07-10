import React, { useEffect, useState } from 'react';
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
  CardFooter,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  useToast,
  Badge,
  IconButton,
  HStack,
  Tooltip
} from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';
import Navbar from './Navbar';
import { ethers } from 'ethers';

const AccountsPage = () => {
  const { 
    isConnected, 
    connectWallet, 
    getSafeAccounts, 
    accounts, 
    provider,
    chainId 
  } = useWeb3();
  
  const [accountBalances, setAccountBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isConnected) {
      fetchAccounts();
    }
  }, [isConnected, chainId]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // Get accounts from Safe Snap
      const accounts = await getSafeAccounts();
      
      // Get balances for each account
      const balances = {};
      if (provider) {
        for (const account of accounts) {
          const balance = await provider.getBalance(account);
          balances[account] = ethers.utils.formatEther(balance);
        }
      }
      
      setAccountBalances(balances);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const getNetworkName = () => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Mumbai Testnet';
      default:
        return 'Unknown Network';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Address copied",
      description: "Address copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <Box flex="1" p={6} bg="gray.50" overflowY="auto">
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="lg">Accounts</Heading>
            <HStack>
              <Badge colorScheme="teal" p={2} borderRadius="md">
                {getNetworkName()}
              </Badge>
              <Button 
                colorScheme="teal" 
                size="sm"
                onClick={fetchAccounts}
                isLoading={loading}
              >
                Refresh
              </Button>
            </HStack>
          </Flex>
          
          {!isConnected ? (
            <Card variant="outline" p={6} textAlign="center">
              <VStack spacing={4}>
                <Heading size="md">Connect Your Wallet</Heading>
                <Text>Connect your wallet to view your Safe accounts</Text>
                <Button colorScheme="teal" onClick={handleConnect}>
                  Connect Wallet
                </Button>
              </VStack>
            </Card>
          ) : loading ? (
            <Flex justify="center" p={10}>
              <Spinner size="xl" color="teal.500" />
            </Flex>
          ) : accounts.length === 0 ? (
            <Card variant="outline" p={6} textAlign="center">
              <VStack spacing={4}>
                <Heading size="md">No Safe Accounts Found</Heading>
                <Text>You don't have any Safe accounts yet</Text>
              </VStack>
            </Card>
          ) : (
            <VStack spacing={4} align="stretch">
              {accounts.map((account, index) => (
                <Card key={account} variant="outline">
                  <CardHeader bg="teal.50" p={4}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Account {index + 1}</Heading>
                      <Badge colorScheme="teal">Safe Account</Badge>
                    </Flex>
                  </CardHeader>
                  
                  <CardBody p={4}>
                    <VStack align="stretch" spacing={3}>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="bold">Address:</Text>
                        <HStack>
                          <Text>{formatAddress(account)}</Text>
                          <Tooltip label="Copy address">
                            <IconButton
                              aria-label="Copy address"
                              icon={<span>📋</span>}
                              size="xs"
                              onClick={() => copyToClipboard(account)}
                            />
                          </Tooltip>
                        </HStack>
                      </Flex>
                      
                      <Divider />
                      
                      <Stat>
                        <StatLabel>Balance</StatLabel>
                        <StatNumber>
                          {accountBalances[account] 
                            ? `${parseFloat(accountBalances[account]).toFixed(4)} ETH` 
                            : <Spinner size="sm" />
                          }
                        </StatNumber>
                        <StatHelpText>
                          {accountBalances[account] && chainId === 1
                            ? `$${(parseFloat(accountBalances[account]) * 3500).toFixed(2)} USD`
                            : 'Value in test network'
                          }
                        </StatHelpText>
                      </Stat>
                    </VStack>
                  </CardBody>
                  
                  <CardFooter bg="gray.50" p={4}>
                    <Flex width="100%" justify="space-between">
                      <Button variant="outline" colorScheme="teal" size="sm">
                        View Details
                      </Button>
                      <Button colorScheme="teal" size="sm">
                        Send Assets
                      </Button>
                    </Flex>
                  </CardFooter>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default AccountsPage;
