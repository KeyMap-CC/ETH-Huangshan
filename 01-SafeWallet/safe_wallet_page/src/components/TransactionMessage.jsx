import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Link,
  Spinner,
  Divider,
  useColorModeValue,
  useToast,
  useDisclosure,
  Icon,
  Image
} from '@chakra-ui/react';
import { NotAllowedIcon } from '@chakra-ui/icons';
import RiskAnalysisModal from './RiskAnalysisModal';
import SecurityProtectionModal from './SecurityProtectionModal';
import TransactionConfirmationModal from './TransactionConfirmationModal';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import contractService from '../api/contractService';
import { parseTransactionMessage, formatTime, getRiskColor } from '../utils/transactionUtils';

/**
 * Component to display transaction requests from the chat bot
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - The message object containing transaction details
 * @param {Function} props.updateMessage - Function to update the message in parent component
 * @returns {JSX.Element} Transaction message component
 */
const TransactionMessage = ({ message, updateMessage, hasProtection = true }) => {
  const { chainId, currentAccount, createTransaction, create7702SingleTransaction } = useWeb3();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localStatus, setLocalStatus] = useState(message.status);
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();
  const [txHash, setTxHash] = useState(message.txHash);
  const [error, setError] = useState(message.error);
  const [riskInfo, setRiskInfo] = useState(message.riskInfo || {});
  const [riskScore, setRiskScore] = useState(message.riskScore);
  const [riskDetails, setRiskDetails] = useState({});
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const { isOpen: isRiskModalOpen, onOpen: onRiskModalOpen, onClose: onRiskModalClose } = useDisclosure();
  const { isOpen: isProtectionModalOpen, onOpen: onProtectionModalOpen, onClose: onProtectionModalClose } = useDisclosure();
  const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure();
  
  // Helper function to update both parent component and local state
  const updateTransactionStatus = (updatedMessage) => {
    setLocalStatus(updatedMessage.status);
    setIsProcessing(updatedMessage.isProcessing);
    setTxHash(updatedMessage.txHash);
    setError(updatedMessage.error);
    if (updatedMessage.riskScore) setRiskScore(updatedMessage.riskScore);
    if (updatedMessage.riskInfo) setRiskInfo(updatedMessage.riskInfo);
    updateMessage(updatedMessage);
  };
  
  // Parse transaction details
  const { symbol, value, chain_id } = message;
  let extraInfo = [];
  let toAddress = '';
  
  try {
    if (message.extra_info) {
      if (typeof message.extra_info === 'string') {
        extraInfo = JSON.parse(message.extra_info);
      } else {
        extraInfo = message.extra_info;
      }
      
      // Try to extract the to address from extra_info
      const toInfo = extraInfo[0];
      if(toInfo.startsWith('0x')){
        toAddress = toInfo;
      }else{
        const toMatch = extraInfo[0]?.match(/to: (0x[a-fA-F0-9]{40})/);
        if (toMatch && toMatch[1]) {
          toAddress = toMatch[1];
        }
      }
    }
  } catch (error) {
    console.error('Error parsing extra_info:', error);
  }
  
  // Check if we have a valid recipient address
  const hasValidAddress = toAddress && toAddress.startsWith('0x') && toAddress.length === 42;
  
  // Check if the transaction request is older than 30 minutes (1800000 ms)
  const isTimeOut = message.timestamp && (Date.now() - message.timestamp > 1800000);

  // Effect to fetch contract risk score if not already available
  useEffect(() => {
    const fetchContractRisk = async () => {
      if (hasValidAddress && toAddress && !riskScore && !isLoadingRisk) {
        try {
          setIsLoadingRisk(true);
          const result = await contractService.scanContract(toAddress, '');
          
          if (result && result.data && result.data.analysisResult) {
            const analysisResult = result.data.analysisResult;
            const score = analysisResult.confidenceScore || 0;
            const details = analysisResult;
            
            setRiskScore(score);
            setRiskInfo(details);
            setRiskDetails(details);
            
            // Update parent component
            updateTransactionStatus({ 
              ...message, 
              riskScore: score, 
              riskInfo: details 
            });
          }
        } catch (error) {
          console.error('Error fetching contract risk:', error);
        } finally {
          setIsLoadingRisk(false);
        }
      }
    };
    
    fetchContractRisk();
  }, [hasValidAddress, toAddress, riskScore, isLoadingRisk, message]);

  // Handle transaction confirmation
  const handleConfirmTransaction = async () => {
    try {
      if(!currentAccount){
        toast({
          title: 'No Account Selected',
          description: 'Please select an account to confirm the transaction',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      setIsProcessing(true);
      
      // Update message status to processing
      updateTransactionStatus({
        ...message,
        status: 'confirmed',
        isProcessing: true
      });
      
      // Extract transaction details
      let toAddress = '';
      
      try {
        if (message.extra_info) {
          let extraInfo = [];
          if (typeof message.extra_info === 'string') {
            extraInfo = JSON.parse(message.extra_info);
          } else {
            extraInfo = message.extra_info;
          }
          const toInfo = extraInfo[0];
          if(toInfo.startsWith('0x')){
            toAddress = toInfo;
          }else{
            const toMatch = extraInfo[0]?.match(/to: (0x[a-fA-F0-9]{40})/);
            if (toMatch && toMatch[1]) {
              toAddress = toMatch[1];
            }
          }
        }
      } catch (error) {
        console.error('Error parsing extra_info:', error);
      }
      
      if (!toAddress) {
        throw new Error('Recipient address not found');
      }
      
      // Send the transaction
      const amountInWei = ethers.utils.parseEther(value).toString();
      // Default txData to '0x' if not provided
      const txData = message.data || '0x';

      // Show security notification before proceeding
      let result;
      if(hasProtection) {
        toast({
          title: "交易安全保障",
          description: "为保障您的交易安全，交易将通过 ERC7702 转发",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        
        // Small delay to allow user to see the notification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        result = await createTransaction(toAddress, amountInWei, txData);
      } else {
        result = await createTransaction(toAddress, amountInWei, txData);
      }
      
      if (result) {
        toast({
          title: "Transaction Created",
          description: "Your transaction has been created and is awaiting confirmation",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        updateTransactionStatus({
          ...message,
          status: 'confirmed',
          isProcessing: false,
          chain_id: chainId,
          txHash: result.hash
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: "Your transaction has failed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        updateTransactionStatus({
          ...message,
          status: 'failed',
          isProcessing: false,
          error: 'Transaction failed'
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
      
      // Update message with error
      updateTransactionStatus({
        ...message,
        status: 'failed',
        isProcessing: false,
        error: error.message || 'Transaction failed'
      });
      
      toast({
        title: 'Transaction Failed',
        description: error.message || 'An error occurred while processing the transaction',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle transaction cancellation
  const handleCancelTransaction = () => {
    // Update both local state and parent component
    updateTransactionStatus({
      ...message,
      status: 'canceled'
    });
    
    toast({
      title: 'Transaction Canceled',
      description: 'You have canceled this transaction',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Format transaction hash for display if available
  const formatTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };
  
  // Get explorer URL based on chain ID
  const getExplorerUrl = (txHash) => {
    const chainExplorerMap = {
      '1': 'https://etherscan.io',
      '5': 'https://goerli.etherscan.io',
      '11155111': 'https://sepolia.etherscan.io',
      '56': 'https://bscscan.com',
      '97': 'https://testnet.bscscan.com'
    };
    
    const baseUrl = chainExplorerMap[chainId] || chainExplorerMap['1'];
    return txHash ? `${baseUrl}/tx/${txHash}` : `${baseUrl}`;
  };
  
  // Get address explorer URL
  const getAddressExplorerUrl = (address) => {
    const baseUrl = getExplorerUrl(null);
    return `${baseUrl}/address/${address}`;
  };
  
  return (
    <Box 
      borderWidth="1px" 
      borderColor={borderColor}
      borderRadius="md" 
      p={2} 
      bg={bgColor}
      width="100%"
      minW="300px"
    >
      <VStack align="start" spacing={3}>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="bold">Transaction Request</Text>
          <Image
            src={hasProtection ? 
              "https://img.icons8.com/?size=100&id=RvwkKNNEaE7T&format=png&color=319795" : 
              "https://img.icons8.com/?size=100&id=QhA10OYH3JMI&format=png&color=319795"}
            alt="No Protection"
            width="24px"
            height="24px"
            cursor="pointer"
            onClick={onProtectionModalOpen}
          />
        </HStack>
        
        <Divider />
        
        <Box width="100%">
          <HStack justify="space-between">
            <Text>Amount:</Text>
            <Text fontWeight="bold">{value} {symbol}</Text>
          </HStack>
          
          {hasValidAddress && (
            <HStack justify="space-between" mt={2}>
              <Text>Risk Score:</Text>
              {isLoadingRisk ? (
                <HStack>
                  <Text fontSize="xs" color="red.500">风险检测中</Text>
                  <Spinner color="red.500" size="sm" />
                </HStack>
              ) : riskScore !== undefined ? (
                <Badge 
                  onClick={onRiskModalOpen}
                  cursor="pointer"
                  colorScheme={getRiskColor(riskScore) === '#DD6B20' ? 'orange' : getRiskColor(riskScore)} 
                  fontSize="sm"
                >
                  {riskScore}/100
                </Badge>
              ) : (
                <Text fontSize="sm" color="gray.500">Not available</Text>
              )}
              
              {/* Risk Analysis Modal */}
              <RiskAnalysisModal
                isOpen={isRiskModalOpen}
                onClose={onRiskModalClose}
                riskInfo={riskInfo}
              />
              <SecurityProtectionModal
                isOpen={isProtectionModalOpen}
                onClose={onProtectionModalClose}
              />
            </HStack>
          )}
          
          {hasValidAddress ? (
            <HStack justify="space-between" mt={2}>
              <Text>To:</Text>
              <Link 
                href={getAddressExplorerUrl(toAddress)} 
                isExternal 
                color="teal.500" 
                fontWeight="bold" 
                fontSize="sm"
              >
                {toAddress.substring(0, 10)}...{toAddress.substring(toAddress.length - 10)}
              </Link>
            </HStack>
          ) : (
            <Box mt={3} p={3} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
              <Text color="gray.400" fontSize="sm" fontWeight="medium">
                我们无法确认您的交易请求，请完整的描述您的交易请求
              </Text>
            </Box>
          )}
        </Box>
        
        {localStatus === 'pending' && (
          <>
            {(isTimeOut && hasValidAddress) ? (
              <Box width="100%" mt={3} p={2} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
                <Text color="gray.400" fontSize="sm" fontWeight="medium" textAlign="center">
                  交易请求已超时（30分钟），无法处理
                </Text>
              </Box>
            ) : hasValidAddress ? (
              <HStack width="100%" spacing={2} mt={2}>
                <Button 
                  colorScheme={getRiskColor(riskScore) === '#DD6B20' ? 'orange' : getRiskColor(riskScore)} 
                  size="sm" 
                  flex={1}
                  onClick={onConfirmModalOpen}
                  isDisabled={isProcessing || message.isProcessing}
                  isLoading={isProcessing}
                  loadingText="Confirming"
                  rightIcon={
                    <Image
                      src="https://img.icons8.com/?size=100&id=23223&format=png&color=ffffff"
                      alt="Confirm"
                      width="20px"
                      height="20px"
                    />
                  }
                >
                  Confirm
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  flex={1}
                  onClick={handleCancelTransaction}
                  isDisabled={isProcessing || message.isProcessing}
                >
                  Cancel
                </Button>
              </HStack>
            ) : null}
          </>
        )}
        
        {localStatus === 'confirmed' && !txHash && (
          <Badge colorScheme="yellow" width="100%" textAlign="center" py={1}>
            Processing transaction...
          </Badge>
        )}
        
        {localStatus === 'confirmed' && txHash && (
          <VStack width="100%" align="start">
            <Badge colorScheme="green" width="100%" textAlign="center" py={1}>
              Transaction Sent
            </Badge>
            <Link 
              href={getExplorerUrl(txHash)} 
              isExternal 
              color="teal.500"
              fontSize="sm"
              width="100%"
              textAlign="center"
            >
              View on Explorer: {formatTxHash(txHash)}
            </Link>
          </VStack>
        )}
        
        {localStatus === 'canceled' && (
          <Badge colorScheme="red" width="100%" textAlign="center" py={1}>
            Transaction Canceled
          </Badge>
        )}
        
        {error && (
          <VStack width="100%" align="start">
            <Badge colorScheme="red" width="100%" textAlign="center" py={1}>
              Transaction Failed
            </Badge>
            <Text fontSize="sm" color="red.500">
              {error || 'An error occurred while processing the transaction.'}
            </Text>
          </VStack>
        )}
      </VStack>
      
      {/* Risk Analysis Modal */}
      <RiskAnalysisModal 
        isOpen={isRiskModalOpen} 
        onClose={onRiskModalClose} 
        riskDetails={riskDetails}
      />
      
      {/* Security Protection Modal */}
      <SecurityProtectionModal 
        isOpen={isProtectionModalOpen} 
        onClose={onProtectionModalClose} 
      />
      
      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={onConfirmModalClose}
        onConfirm={handleConfirmTransaction}
        riskScore={riskScore}
        hasProtection={hasProtection}
        onBuyProtection={onProtectionModalOpen}
      />
    </Box>
  );
};

export default TransactionMessage;
