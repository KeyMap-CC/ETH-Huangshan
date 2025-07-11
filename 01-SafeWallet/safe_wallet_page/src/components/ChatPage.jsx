import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Input, 
  Button, 
  Text, 
  VStack, 
  HStack, 
  Avatar, 
  IconButton,
  useColorModeValue,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import MarkdownMessage from './MarkdownMessage';
import PaperAirplaneIcon from './PaperAirplaneIcon';
import ShieldBotAvatar from './ShieldBotAvatar';
import SmileyAvatar from './SmileyAvatar';
import TypingIndicator from './TypingIndicator';
import TransactionMessage from './TransactionMessage';
import { useWeb3 } from '../context/Web3Context';
import { chatService } from '../api';
import Navbar from './Navbar';
import { parseTransactionMessage, formatTime } from '../utils/transactionUtils';
import { 
  saveChatMessages, 
  loadChatMessages, 
  saveChatId, 
  loadChatId, 
  saveChatInfo, 
  loadChatInfo 
} from '../utils/chatStorageUtils';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { account, isProtected } = useWeb3();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Initialize chat when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a stored chatId
        const storedChatId = loadChatId(account);
        if (storedChatId) {
          // We have an existing chat
          setChatId(storedChatId);
          
          // Load chat history from localStorage
          const storedMessages = loadChatMessages(account);
          if (storedMessages) {
            const filteredMessages = storedMessages;
            
            // Check if we have more than 10 messages
            if (filteredMessages.length > 10) {
              // Keep the first message (welcome) and the last 9 messages
              const trimmedMessages = [
                filteredMessages[0],
                ...filteredMessages.slice(-9)
              ];
              setMessages(trimmedMessages);
            } else {
              setMessages(filteredMessages);
            }
          } else {
            // If we have a chatId but no messages, initialize with welcome message
            setMessages([{ 
              id: 1, 
              text: 'Welcome back to Safe Wallet! How can I help you today?', 
              sender: 'bot', 
              timestamp: Date.now() 
            }]);
          }
        } else {
          await createNewChat();
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Fallback to basic initialization if API fails
        setMessages([{ 
          id: 1, 
          text: 'Welcome to Safe Wallet! How can I help you today?', 
          sender: 'bot', 
          timestamp: Date.now() 
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeChat();
  }, []);
  
  // Update a specific message by ID
  const updateMessage = () => {
    saveChatMessages(account, messages);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Auto-adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to match the content (scrollHeight)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewChat = async () => {
    try {
      // Create a new chat
      const response = await chatService.newChat();
      console.log('New chat created:', response);
      
      // Extract data from response
      const chatData = response.data || response;
      
      // Store all chat information
      const chatInfo = {
        id: chatData.id,
        userId: chatData.userId,
        chatId: chatData.chatId,
        conversationId: chatData.conversationId,
        createdAt: chatData.createdAt,
        updatedAt: chatData.updatedAt
      };
      
      // Store the complete chat info
      saveChatInfo(account, chatInfo);
      
      // Get chatId from response
      const newChatId = chatData.chatId;
      setChatId(newChatId);
      saveChatId(account, newChatId);
      
      // Initialize with welcome message
      const initialMessages = [{ 
        id: 1, 
        text: account ? `Welcome back to Safe Wallet! How can I help you today?` : `Please connect your wallet to start chatting.`, 
        sender: 'bot', 
        timestamp: Date.now() 
      }];
      setMessages(initialMessages);
      
      // Save initial messages to localStorage
      saveChatMessages(account, initialMessages);
      
      return newChatId;
    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // If no chatId, create a new chat first
    if (!chatId) {
      try {
        await createNewChat();
      } catch (error) {
        console.error('Failed to create chat before sending message:', error);
        return;
      }
    }
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: Date.now()
    };
    
    // Update UI immediately with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    
    // Save to localStorage
    saveChatMessages(account, updatedMessages);
    
    try {
      // Show typing indicator
      const typingMessage = {
        id: updatedMessages.length + 1,
        text: '...',
        sender: 'bot',
        timestamp: Date.now(),
        isTyping: true
      };
      
      setMessages([...updatedMessages, typingMessage]);
      
      // Send message to API
      const response = await chatService.sendMessage(chatId, inputMessage);
      
      // Extract the answer from the response data structure
      const responseData = response.data || response;
      const botMessage = responseData.answer || 
                        (responseData.data && responseData.data.answer) || 
                        'I received your message.';
      
      // Create bot response object
      let botResponse = {
        id: updatedMessages.length + 1,
        text: botMessage,
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
      
      // Save updated conversation to localStorage
      saveChatMessages(account, finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator and add error message
      const errorMessage = {
        id: updatedMessages.length + 1,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: Date.now(),
        isError: true
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      // Save conversation with error to localStorage
      saveChatMessages(account, finalMessages);
    }
  };

  return (
    <Box height="90vh" display="flex" flexDirection="column">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Chat Container */}
      <Flex 
        flex="1" 
        direction="column" 
        bg={bgColor}
        overflow="hidden"
      >       
        {/* Messages Area */}
        <VStack 
          flex="1" 
          spacing={4} 
          p={4}
          align="stretch" 
          overflowY="auto" 
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'teal',
              borderRadius: '24px',
            },
          }}
          pb={4}
        >
          {messages.map((message) => (
            <Box 
              key={`${message.id}-${Math.random().toString(36).substring(2, 9)}`} 
              alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
              maxW="90%"
              width="auto"
            >
              <HStack spacing={2} align="flex-start">
                {message.sender === 'bot' && (
                  <Box width="24px" height="24px" flexShrink={0}>
                    <ShieldBotAvatar size="xs" />
                  </Box>
                )}
                
                <Box>
                  <Box 
                    bg={message.sender === 'user' ? 'teal.500' : 'gray.200'} 
                    color={message.sender === 'user' ? 'white' : 'black'}
                    p={3} 
                    borderRadius="lg"
                    boxShadow="sm"
                    overflowWrap="break-word"
                    wordBreak="break-word"
                  >
                    {message.sender === 'user' ? (
                      <Text whiteSpace="pre-wrap">{message.text}</Text>
                    ) : message.isTyping ? (
                      <TypingIndicator />
                    ) : message.text && message.text.includes('send_transaction') ? (
                      <TransactionMessage 
                        message={parseTransactionMessage(message.text || message.answer, message.timestamp)} 
                        hasProtection={isProtected}
                        updateMessage={updatedMsg => {
                          message.text = JSON.stringify(updatedMsg);
                          updateMessage(message);
                        }} 
                      />
                    ) : (
                      <MarkdownMessage content={message.text} />
                    )}
                  </Box>
                  <Text fontSize="xs" color="gray.500" textAlign={message.sender === 'user' ? 'right' : 'left'}>
                    {formatTime(message.timestamp)}
                  </Text>
                </Box>
                
                {message.sender === 'user' && (
                  <Box width="24px" height="24px" flexShrink={0}>
                    <SmileyAvatar size="xs" />
                  </Box>
                )}
              </HStack>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
        
        {/* Input Area */}
        <Box 
          p={3} 
          borderTop="1px" 
          borderColor={borderColor}
          bg="white"
          mt={2}
        >
          <HStack alignItems="flex-end">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              variant="filled"
              bg="gray.100"
              _hover={{ bg: 'gray.200' }}
              _focus={{ bg: 'gray.200', borderColor: 'teal.500' }}
              resize="none"
              rows={1}
              minH="40px"
              maxH="120px"
              overflow="hidden"
            />
            <IconButton
              colorScheme="teal"
              aria-label="Send message"
              icon={<PaperAirplaneIcon />}
              onClick={handleSendMessage}
              height="40px"
              width="40px"
              borderRadius="full"
            />
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChatPage;
