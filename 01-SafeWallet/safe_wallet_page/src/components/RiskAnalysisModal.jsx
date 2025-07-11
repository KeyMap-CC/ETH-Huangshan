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
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Tag,
  TagLabel,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';

/**
 * Modal component to display detailed contract risk analysis results
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.riskInfo - Risk analysis data
 * @returns {JSX.Element} Risk analysis modal
 */
const RiskAnalysisModal = ({ isOpen, onClose, riskInfo }) => {
  if (!riskInfo) return null;

  // Helper function to get color based on security level
  const getSecurityLevelColor = (level) => {
    if (!level) return 'gray';
    
    switch (level.toUpperCase()) {
      case 'LOW':
        return 'green';
      case 'MEDIUM':
        return 'orange';
      case 'HIGH':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Helper function to get color based on recommendation
  const getRecommendationColor = (recommendation) => {
    if (!recommendation) return 'gray';
    
    switch (recommendation.toUpperCase()) {
      case 'APPROVE':
        return 'green';
      case 'APPROVE WITH CAUTION':
        return 'yellow';
      case 'REJECT':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Helper function to get icon based on recommendation
  const getRecommendationIcon = (recommendation) => {
    if (!recommendation) return <InfoIcon />;
    
    switch (recommendation.toUpperCase()) {
      case 'APPROVE':
        return <CheckCircleIcon />;
      case 'APPROVE WITH CAUTION':
        return <WarningIcon color="yellow.500" />;
      case 'REJECT':
        return <WarningIcon color="red.500" />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="380px">
        <ModalHeader>
          Contract Risk Analysis
          <Badge 
            ml={2} 
            colorScheme={getSecurityLevelColor(riskInfo.overallSecurityLevel)}
          >
            {riskInfo.overallSecurityLevel || 'UNKNOWN'} RISK
          </Badge>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box p={3} borderWidth="1px" borderRadius="md">
              <HStack justify="space-between">
                <Text fontWeight="bold">Overall Recommendation:</Text>
                <Badge colorScheme={getRecommendationColor(riskInfo.overallRecommendation)}>
                  {riskInfo.overallRecommendation || 'UNKNOWN'}
                </Badge>
              </HStack>
              
              <HStack mt={2} justify="space-between">
                <Text fontWeight="bold">Confidence Score:</Text>
                <Text>{riskInfo.confidenceScore || 0}/100</Text>
              </HStack>
            </Box>

            <Divider />
            
            <Text fontWeight="bold" fontSize="lg">Detailed Analysis</Text>
            
            {riskInfo.batchResults?.map((batch, index) => (
              <Box 
                key={index} 
                p={3} 
                borderWidth="1px" 
                borderRadius="md" 
                borderColor={getSecurityLevelColor(batch.result?.securityLevel) + '.200'}
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold" textTransform="capitalize">
                    {batch.batchName?.replace(/_/g, ' ')}
                  </Text>
                  <Badge colorScheme={getSecurityLevelColor(batch.result?.securityLevel)}>
                    {batch.result?.securityLevel || 'UNKNOWN'} RISK
                  </Badge>
                </HStack>
                
                {batch.result?.detectedIssues?.length > 0 && (
                  <Box mt={2}>
                    <Text fontWeight="semibold">Detected Issues:</Text>
                    <List spacing={1} mt={1}>
                      {batch.result.detectedIssues.map((issue, i) => (
                        <ListItem key={i} fontSize="14px" display="flex" alignItems="flex-start">
                          <ListIcon as={WarningIcon} color="orange.500" mt={1} />
                          <Text>{issue}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                {batch.result?.attackTypes?.length > 0 && (
                  <Box mt={3}>
                    <Text fontWeight="semibold">Potential Attack Types:</Text>
                    <HStack mt={1} flexWrap="wrap" spacing={2}>
                      {batch.result.attackTypes.map((attack, i) => (
                        <Tag key={i} colorScheme="red" size="sm" mt={1}>
                          <TagLabel>{attack}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                  </Box>
                )}
                
                {batch.result?.confidenceScore && (
                  <HStack mt={2} justify="space-between">
                    <Text fontWeight="semibold">Confidence:</Text>
                    <Text>{batch.result.confidenceScore}/100</Text>
                  </HStack>
                )}
                
                {batch.result?.evidence && (
                  <Box mt={3}>
                    <Text fontWeight="semibold">Evidence:</Text>
                    <Text mt={1} fontSize="sm">{batch.result.evidence}</Text>
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RiskAnalysisModal;
