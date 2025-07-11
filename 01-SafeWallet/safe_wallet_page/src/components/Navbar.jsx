import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Button, 
  Text, 
  Select, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  useClipboard, 
  Tooltip, 
  HStack, 
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Card,
  CardBody,
  Icon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api';
import { useWeb3 } from '../context/Web3Context';
import { getNetworkIcon } from './NetworkIcons';
import SafeWalletLogo from './SafeWalletLogo';
import { CopyIcon } from '@chakra-ui/icons';
import SecurityProtectionModal from './SecurityProtectionModal';

// Shield icon component
const ShieldIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.91 11.12C20.91 16.01 17.36 20.59 12.51 21.93C12.18 22.02 11.82 22.02 11.49 21.93C6.64 20.59 3.09 16.01 3.09 11.12V6.73C3.09 5.91 3.71 4.98 4.48 4.67L10.05 2.39C11.3 1.93 12.71 1.93 13.96 2.39L19.53 4.67C20.29 4.98 20.92 5.91 20.92 6.73V11.12H20.91Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Copy button component with tooltip feedback
const CopyButton = ({ value }) => {
  const { hasCopied, onCopy } = useClipboard(value);
  
  return (
    <Tooltip hasArrow label={hasCopied ? 'Copied!' : 'Copy'} placement="top">
      <IconButton
        aria-label="Copy address"
        icon={<CopyIcon />}
        size="sm"
        onClick={onCopy}
        colorScheme="teal"
        variant="ghost"
      />
    </Tooltip>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isProtectionModalOpen, onOpen: onProtectionModalOpen, onClose: onProtectionModalClose } = useDisclosure();
  const { 
    isConnected, 
    connectWallet, 
    setIsProtected,
    currentAccount, 
    chainId,
    switchChain,
    getIsExchange
  } = useWeb3();
  
  // Try to connect wallet and check protection status on component mount
  useEffect(() => {
    const tryConnectWallet = async () => {
      try {
        // Attempt to connect wallet silently
        const accounts = await connectWallet();
        const isLoggedIn = authService.isAuthenticated();
        console.log('User authentication status:', isLoggedIn ? 'Logged in' : 'Not logged in');
        if (!isLoggedIn) {
          console.log('User not authenticated, starting login process...');
          
          // Create signature parameters
          const timestamp = Date.now();
          const nonce = Math.floor(Math.random() * 1000000).toString();
          const message = `Safe Wallet Authentication\n\nAddress: ${accounts[0]}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
                  
          // Request signature from user
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, accounts[0]]
          });
          
          // Call login API with signature
          await authService.login(accounts[0], timestamp, nonce, signature);
          console.log('Authentication successful');
        }

        // If we have an account, check if it has protection
        if (accounts && accounts.length > 0) {
          const isExchanged = await getIsExchange(accounts[0]);
          console.log('Is exchanged:', isExchanged);
          setIsProtected(isExchanged);
        }
        
        // No need to show any UI if connection fails
      } catch (error) {
        // Silently handle the error
        console.log('Silent wallet connection attempt failed');
      }
    };
    
    tryConnectWallet();
  }, []);

  // Available chains
  const chains = [
    { id: 1, name: 'Ethereum Mainnet', icon: 'https://img.icons8.com/fluent/512/ethereum.png' },
    { id: 5, name: 'Goerli Testnet', icon: 'https://img.icons8.com/deco/512/ethereum.png' },
    { id: 11155111, name: 'Sepolia Testnet', icon: 'https://img.icons8.com/deco/512/ethereum.png' },
    { id: 137, name: 'Polygon Mainnet', icon: 'https://cdn-icons-png.freepik.com/512/12114/12114233.png' },
    { id: 80001, name: 'Mumbai Testnet', icon: 'https://img.icons8.com/?size=100&id=LhueiMPUoxw4&format=png&color=000000' },
  ];

  const handleConnect = async () => {
    try {
      // First connect the wallet
      const accounts = await connectWallet();
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        const isExchanged = await getIsExchange(address);
        console.log('Is exchanged:', isExchanged);
        setIsProtected(isExchanged);
        
        // Check if user is already authenticated
        // const isLoggedIn = authService.isAuthenticated();
        // console.log('User authentication status:', isLoggedIn ? 'Logged in' : 'Not logged in');
        
        // // If not authenticated, proceed with login flow
        // if (!isLoggedIn) {
        //   console.log('User not authenticated, starting login process...');
          
        //   // Create signature parameters
        //   const timestamp = Date.now();
        //   const nonce = Math.floor(Math.random() * 1000000).toString();
        //   const message = `Safe Wallet Authentication\n\nAddress: ${address}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
                  
        //   // Request signature from user
        //   const signature = await window.ethereum.request({
        //     method: 'personal_sign',
        //     params: [message, address]
        //   });
          
        //   // Call login API with signature
        //   await authService.login(address, timestamp, nonce, signature);
        //   console.log('Authentication successful');
        // } else {
        //   console.log('User already authenticated, skipping login process');
        //   // Optionally verify token validity here if needed
        // }
      }
    } catch (error) {
      console.error('Connection or authentication error:', error);
      // If error is related to authentication, clear token and retry
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Authentication token invalid or expired, logging out and retrying...');
        authService.logout();
        // Retry the connection process
        return handleConnect();
      }
      // Handle other errors (show toast notification, etc.)
    }
  };

  return (
    <Flex 
      as="nav" 
      align="center" 
      justify="space-between" 
      wrap="wrap" 
      padding="1rem" 
      bg="teal.500" 
      color="white"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      {/* Logo/App Name and Wallet Connection on the same line */}
      <Flex width="100%" justify="space-between" align="center">
        <Box>
          <HStack spacing={2} cursor="pointer" onClick={() => navigate('/')}>
            <SafeWalletLogo boxSize="32px" />
            <Text fontSize="xl" fontWeight="bold">
              SafeWallet
            </Text>
          </HStack>
        </Box>

        {isConnected ? (
          <Menu>
            <MenuButton as={Button} colorScheme="teal" variant="outline" bg="teal.50" color="teal.500">
              {currentAccount ? 
              <HStack>
                <Box boxSize="24px">
                  {chains.find(chain => chain.id === chainId)?.icon ? 
                    <img src={chains.find(chain => chain.id === chainId)?.icon} alt="Current network" width="24" height="24" /> : 
                    getNetworkIcon(chainId)
                  }
                </Box>
                <Text fontSize="sm" isTruncated maxWidth="200px">
                  {currentAccount.substring(0, 6)}...{currentAccount.substring(currentAccount.length - 4)}
                </Text>
              </HStack>
                : 
                'Connected'}
            </MenuButton>
            <MenuList color="black">
              {currentAccount && (
                <Box p={3} borderBottomWidth="1px" borderColor="gray.200">
                  <HStack spacing={2} width="100%" justify="space-between">
                    <Text fontSize="sm" isTruncated maxWidth="200px">
                      {currentAccount}
                    </Text>
                    <CopyButton value={currentAccount} />
                  </HStack>
                </Box>
              )}
              <MenuItem onClick={() => navigate('/chat')}>Chat</MenuItem>
              <MenuItem onClick={() => navigate('/accounts')}>Accounts</MenuItem>
              <MenuItem onClick={() => navigate('/transactions')}>New Transaction</MenuItem>
              <MenuItem onClick={() => navigate('/history')}>History</MenuItem>
              <MenuItem onClick={onOpen}>Switch Network</MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              <MenuItem onClick={onProtectionModalOpen} color="teal.500">
                <HStack>
                  <Icon as={ShieldIcon} />
                  <Text>Purchase Protection</Text>
                </HStack>
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button bg="teal.50" color="teal.500" _hover={{ bg: 'teal.100' }} colorScheme="teal" variant="outline" onClick={handleConnect}>
            Connect Wallet
          </Button>
        )}
      </Flex>

      {/* Network Switching Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent width="350px">
          <ModalHeader>Switch Network</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={1} spacing={4}>
              {chains.map((chain) => (
                <Card 
                  key={chain.id} 
                  variant="outline" 
                  cursor="pointer"
                  _hover={{ borderColor: 'teal.500', shadow: 'md' }}
                  borderColor={chainId === chain.id ? 'teal.500' : 'gray.200'}
                  bg={chainId === chain.id ? 'teal.50' : 'white'}
                  onClick={async () => {
                    await switchChain(chain.id);
                    onClose();
                  }}
                >
                  <CardBody>
                    <HStack spacing={3}>
                      <Box boxSize="24px">
                        {chain.icon ? <img src={chain.icon} alt={chain.name} width="24" height="24" /> : getNetworkIcon(chain.id)}
                      </Box>
                      <Text fontWeight={chainId === chain.id ? 'bold' : 'normal'}>
                        {chain.name}
                      </Text>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Security Protection Modal */}
      <SecurityProtectionModal 
        isOpen={isProtectionModalOpen} 
        onClose={onProtectionModalClose} 
      />
    </Flex>
  );
};

export default Navbar;
