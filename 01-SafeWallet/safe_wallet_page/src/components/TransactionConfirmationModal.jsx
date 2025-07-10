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
  Box,
  Flex,
  Icon,
  Image,
  Badge
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { getRiskColor, getRiskLevel } from '../utils/transactionUtils.jsx';

/**
 * Transaction confirmation modal with risk-based messaging
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {function} props.onConfirm - Function to confirm the transaction
 * @param {number} props.riskScore - Risk score (0-100)
 * @param {boolean} props.hasProtection - Whether the user has purchased protection
 * @param {function} props.onBuyProtection - Function to open protection purchase modal
 */
const TransactionConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  riskScore = 0,
  hasProtection = true,
  onBuyProtection
}) => {
  // Determine risk level
  const isLowRisk = getRiskLevel(riskScore) === 'Low';
  const isHighRisk = getRiskLevel(riskScore) === 'High';
  const isMediumRisk = !isLowRisk && !isHighRisk;
  
  // Get color based on risk
  const riskColor = hasProtection ? '#319795' : getRiskColor(riskScore);
  
  // Get appropriate icon based on risk level
  const RiskIcon = isLowRisk ? CheckCircleIcon : isHighRisk ? WarningTwoIcon : WarningIcon;
  
  // Handle confirmation
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
      <ModalContent 
        borderTop="4px solid" 
        borderColor={riskColor} 
        maxW="300px"
        boxShadow="0 10px 25px -5px rgba(0,0,0,0.2)"
        borderRadius="md"
      >
        <ModalHeader 
          color={riskColor} 
          fontSize="lg" 
          fontWeight="bold"
          pb={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {isLowRisk ? '交易确认' : isHighRisk ? '高风险交易警告' : '中风险交易提醒'}
          {hasProtection && (
            <Badge colorScheme="teal" fontSize="xs" ml={2} px={2} py={1} borderRadius="full">
              已保障
            </Badge>
          )}
        </ModalHeader>
        <ModalBody pb={6}>
          <Flex 
            direction="column" 
            align="center" 
            mb={4}
            bg={hasProtection ? "teal.50" : isLowRisk ? "green.50" : isHighRisk ? "red.50" : "orange.50"}
            p={4}
            borderRadius="md"
          >
            {
              hasProtection ? (
                <Image
                  src="https://img.icons8.com/?size=100&id=RvwkKNNEaE7T&format=png&color=319795"
                  alt="Protected"
                  w={14}
                  h={14}
                  mb={4}
                />
              ) : (
                <Icon 
                  as={RiskIcon} 
                  w={14} 
                  h={14} 
                  color={riskColor} 
                  mb={4} 
                  filter={isHighRisk ? "drop-shadow(0 0 2px rgba(229, 62, 62, 0.5))" : "none"}
                />
              )
            }
            
            {isLowRisk && (
              <Text 
                textAlign="center"
                fontSize="md"
                fontWeight="medium"
              >
                交易风险较低，请放心操作。
              </Text>
            )}
            
            {!isLowRisk && hasProtection && (
              <Box textAlign="center" color="teal.600">
                <Text fontWeight="bold" mb={2} fontSize="md">
                  您已经购买了风险保障
                </Text>
                <Text fontSize="sm" lineHeight="1.6">
                  如果本交易出现风险，SafeWallet 将赔付交易金额的 <Text as="span" fontWeight="bold">50%</Text>。
                </Text>
              </Box>
            )}
            
            {!isLowRisk && !hasProtection && (
              <Box 
                textAlign="center" 
                cursor="pointer" 
                onClick={() => {
                  onClose();
                  onBuyProtection();
                }}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)" }}
              >
                <Text 
                  mb={3} 
                  color={riskColor}
                  fontWeight="semibold"
                  fontSize="md"
                >
                  {isMediumRisk ? '交易存在风险，请停止交易' : '交易风险较高，请停止交易'}
                </Text>
                <Box 
                  bg={riskColor} 
                  color="white" 
                  py={2} 
                  px={4} 
                  borderRadius="md"
                  boxShadow="0 4px 6px -1px rgba(0, 128, 128, 0.3)"
                >
                  <Text fontWeight="bold" fontSize="md">
                    购买风险保障
                  </Text>
                  <Text fontSize="xs" mt={1}>
                    获得交易金额最高 80% 的赔付
                  </Text>
                </Box>
              </Box>
            )}
          </Flex>
        </ModalBody>

        <ModalFooter display="flex" justifyContent="space-between" px={4} py={4} borderTop="1px solid" borderColor="gray.100">
          <Button 
            colorScheme={hasProtection ? 'teal' : isMediumRisk ? 'orange' : isHighRisk ? 'red' : 'green'} 
            onClick={handleConfirm}
            flex="1"
            mr={2}
            height="44px"
            fontSize="md"
            fontWeight="bold"
            boxShadow="sm"
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "md"
            }}
          >
            继续交易
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onClose} 
            flex="1" 
            ml={2}
            height="44px"
            fontSize="md"
            borderWidth="1px"
            _hover={{
              bg: "gray.50"
            }}
          >
            取消
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionConfirmationModal;
