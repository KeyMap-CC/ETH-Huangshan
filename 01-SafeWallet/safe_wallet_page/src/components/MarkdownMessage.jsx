import React from 'react';
import {
  Box,
  Code,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

/**
 * MarkdownMessage component for rendering markdown content in chat messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - The markdown content to render
 * @returns {JSX.Element} Rendered markdown content
 */
const MarkdownMessage = ({ content }) => {
  return (
    <Box className="markdown-body" pl={2}>
      <ReactMarkdown
        components={{
          code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\\w+)/.exec(className || '');
            return !inline ? (
              <Box 
                as="pre" 
                p={2} 
                borderRadius="md" 
                bg="gray.700" 
                overflowX="auto"
                fontSize="sm"
                my={2}
              >
                <Code 
                  className={className} 
                  colorScheme="gray"
                  whiteSpace="pre"
                  display="block"
                  {...props}
                >
                  {children}
                </Code>
              </Box>
            ) : (
              <Code 
                colorScheme="gray" 
                px={1} 
                fontSize="0.9em" 
                {...props}
              >
                {children}
              </Code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownMessage;
