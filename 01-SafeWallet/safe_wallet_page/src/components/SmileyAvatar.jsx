import React from 'react';
import { Box } from '@chakra-ui/react';

const SmileyAvatar = ({ size = 'md', ...props }) => {
  // Size mapping
  const sizeMap = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '56px'
  };
  
  const boxSize = sizeMap[size] || sizeMap.md;
  
  return (
    <Box 
      width={boxSize} 
      height={boxSize} 
      borderRadius="full" 
      bg="yellow.400"
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <svg 
        width="70%" 
        height="70%" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Eyes */}
        <circle cx="6" cy="8" r="2" fill="#333" />
        <circle cx="18" cy="8" r="2" fill="#333" />
        
        {/* Smile */}
        <path 
          d="M7 17C7 17 9 20 12 20C15 20 17 17 17 17" 
          stroke="#333" 
          strokeWidth="2"
          strokeLinecap="round" 
        />
      </svg>
    </Box>
  );
};

export default SmileyAvatar;
