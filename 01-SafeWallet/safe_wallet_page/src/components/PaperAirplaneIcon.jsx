import React from 'react';
import { Icon } from '@chakra-ui/react';

const PaperAirplaneIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M22,12L11,22V15.5L3,18L2,12L3,6L11,8.5V2L22,12z"
    />
    <path
      fill="currentColor"
      d="M11,8.5V15.5L5.17,12L11,8.5z"
      opacity="0.3"
    />
  </Icon>
);

export default PaperAirplaneIcon;
