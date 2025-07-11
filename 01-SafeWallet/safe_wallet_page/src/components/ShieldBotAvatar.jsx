import React from 'react';
import { Box } from '@chakra-ui/react';

const ShieldBotAvatar = ({ size = "sm" }) => {
  // Size mapping
  const sizeMap = {
    xs: { width: "24px", height: "24px" },
    sm: { width: "32px", height: "32px" },
    md: { width: "48px", height: "48px" },
    lg: { width: "64px", height: "64px" }
  };
  
  const dimensions = sizeMap[size] || sizeMap.sm;
  
  return (
    <Box 
      width={dimensions.width} 
      height={dimensions.height}
      flexShrink={0}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield outline */}
        <path 
          d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
          stroke="#319795" 
          strokeWidth="2" 
          fill="#E6FFFA"
        />
        
        {/* Robot head */}
        <rect x="8" y="8" width="8" height="7" rx="1" fill="#319795" />
        
        {/* Robot eyes */}
        <circle cx="9.5" cy="10.5" r="1" fill="white" />
        <circle cx="14.5" cy="10.5" r="1" fill="white" />
        
        {/* Robot mouth */}
        <path d="M10 13H14" stroke="white" strokeWidth="1" />
      </svg>
    </Box>
  );
};

export default ShieldBotAvatar;
