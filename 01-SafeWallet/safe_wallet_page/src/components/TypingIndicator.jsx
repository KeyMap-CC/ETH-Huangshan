import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

/**
 * Animated typing indicator with three dots
 * @returns {JSX.Element} Typing indicator component
 */
const TypingIndicator = () => {
  const [dots, setDots] = useState('.');
  
  // Animation for the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500); // Change dots every 500ms
    
    return () => clearInterval(interval);
  }, []);
  
  // Blinking animation
  const blink = keyframes`
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
  `;
  
  return (
    <Box
      fontWeight="bold"
      animation={`${blink} 1.4s infinite ease-in-out`}
      fontSize="lg"
      letterSpacing="2px"
      my={1}
    >
      {dots}
    </Box>
  );
};

export default TypingIndicator;
