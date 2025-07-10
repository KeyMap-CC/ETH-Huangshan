import React from 'react';
import { Icon } from '@chakra-ui/react';

const SafeWalletLogo = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    {/* Shield outline */}
    <path
      fill="currentColor"
      d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z"
      opacity="0.9"
    />
  </Icon>
);

export default SafeWalletLogo;
