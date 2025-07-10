import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  useToast,
  Link,
  Card,
  CardHeader,
  CardBody,
  Select,
  HStack,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';
import Navbar from './Navbar';

const HistoryPage = () => {
  const { 
    isConnected, 
    connectWallet, 
    getTransactionHistory, 
    transactions,
    chainId 
  } = useWeb3();
  
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const toast = useToast();

  useEffect(() => {
    if (isConnected) {
      fetchTransactionHistory();
    }
  }, [isConnected, chainId]);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      await getTransactionHistory();
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transaction history",
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

  const getExplorerUrl = (hash) => {
    let baseUrl = '';
    switch (chainId) {
      case 1:
        baseUrl = 'https://etherscan.io/tx/';
        break;
      case 5:
        baseUrl = 'https://goerli.etherscan.io/tx/';
        break;
      case 11155111:
        baseUrl = 'https://sepolia.etherscan.io/tx/';
        break;
      case 137:
        baseUrl = 'https://polygonscan.com/tx/';
        break;
      case 80001:
        baseUrl = 'https://mumbai.polygonscan.com/tx/';
        break;
      default:
        baseUrl = 'https://etherscan.io/tx/';
    }
    return baseUrl + hash;
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.status.toLowerCase() === filter.toLowerCase();
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <Box flex="1" p={6} bg="gray.50" overflowY="auto">
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <Heading size="lg">Transaction History</Heading>
            <HStack>
              <Badge colorScheme="teal" p={2} borderRadius="md">
                {getNetworkName()}
              </Badge>
              <Button 
                colorScheme="teal" 
                size="sm"
                onClick={fetchTransactionHistory}
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
                <Text>Connect your wallet to view your transaction history</Text>
                <Button colorScheme="teal" onClick={handleConnect}>
                  Connect Wallet
                </Button>
              </VStack>
            </Card>
          ) : loading ? (
            <Flex justify="center" p={10}>
              <Spinner size="xl" color="teal.500" />
            </Flex>
          ) : (
            <Card variant="outline">
              <CardHeader bg="white" p={4}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <Heading size="sm">Transactions</Heading>
                  <Select 
                    size="sm" 
                    width="200px" 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Transactions</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="failed">Failed</option>
                  </Select>
                </Flex>
              </CardHeader>
              
              <CardBody p={0}>
                {filteredTransactions.length === 0 ? (
                  <Box p={6} textAlign="center">
                    <Text>No transactions found</Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>To</Th>
                          <Th>Amount</Th>
                          <Th>Status</Th>
                          <Th>Hash</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredTransactions.map((tx) => (
                          <Tr key={tx.id}>
                            <Td>{formatDate(tx.timestamp)}</Td>
                            <Td>
                              <HStack>
                                <Text>{formatAddress(tx.to)}</Text>
                                <Tooltip label="Copy address">
                                  <IconButton
                                    aria-label="Copy address"
                                    icon={<span>📋</span>}
                                    size="xs"
                                    onClick={() => copyToClipboard(tx.to)}
                                  />
                                </Tooltip>
                              </HStack>
                            </Td>
                            <Td>{tx.value} ETH</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(tx.status)}>
                                {tx.status}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack>
                                <Text>{tx.hash ? formatAddress(tx.hash) : 'N/A'}</Text>
                                {tx.hash && (
                                  <Tooltip label="Copy hash">
                                    <IconButton
                                      aria-label="Copy hash"
                                      icon={<span>📋</span>}
                                      size="xs"
                                      onClick={() => copyToClipboard(tx.hash)}
                                    />
                                  </Tooltip>
                                )}
                              </HStack>
                            </Td>
                            <Td>
                              {tx.hash && (
                                <Link 
                                  href={getExplorerUrl(tx.hash)} 
                                  isExternal 
                                  color="teal.500"
                                >
                                  View
                                </Link>
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default HistoryPage;
