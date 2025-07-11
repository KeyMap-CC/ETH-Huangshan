/**
 * Utility functions for handling transaction messages
 */

// Risk level definitions
const RISK_LEVEL = {
  1: { color: 'green', colorScheme: 'green', label: 'Low', minScore: 0, maxScore: 39 },
  2: { color: '#DD6B20', colorScheme: 'orange', label: 'Medium', minScore: 40, maxScore: 74 },
  3: { color: 'red', colorScheme: 'red', label: 'High', minScore: 75, maxScore: 100 }
};

/**
 * Get color based on risk score
 * @param {number} score - Risk score (0-100)
 * @returns {string} Color scheme name for the risk level (compatible with Chakra UI)
 */
export const getRiskColor = (score) => {
  if (!score && score !== 0) return 'gray';
  
  for (const level of Object.values(RISK_LEVEL)) {
    if (score >= level.minScore && score <= level.maxScore) {
      return level.colorScheme;
    }
  }
  
  return 'gray';
};

export const getRiskLevel = (score) => {
  if (!score && score !== 0) return 'Unknown';
  
  for (const level of Object.values(RISK_LEVEL)) {
    if (score >= level.minScore && score <= level.maxScore) {
      return level.label;
    }
  }
  
  return 'Unknown';
};

/**
 * Parse transaction message from text
 * @param {string} text - The message text to parse
 * @returns {Object} The parsed transaction data
 */
export const parseTransactionMessage = (text, timestamp) => {
  try {
    // Special case for the specific format we're seeing in the error
    if (text && text.includes("'action': 'send_transaction'")) {
      // Extract key information using regex
      const valueMatch = text.match(/['"](value)['"]\s*:\s*['"]([^'"]+)['"]/);
      const symbolMatch = text.match(/['"](symbol)['"]\s*:\s*['"]([^'"]+)['"]/);
      const addressMatch = text.match(/['"](to)['"]\s*:\s*['"]?(0x[a-fA-F0-9]{40})['"]?/);
      const chainIdMatch = text.match(/['"](chain_id)['"]\s*:\s*['"]([^'"]+)['"]/);
      
      // Create transaction object with extracted data
      const transaction = {
        action: 'send_transaction',
        status: 'pending',
        timestamp: timestamp,
        value: valueMatch ? valueMatch[2] : '0',
        symbol: symbolMatch ? symbolMatch[2] : 'ETH',
        chain_id: chainIdMatch ? chainIdMatch[2] : '1'
      };
      
      // Add recipient address if found
      if (addressMatch && addressMatch[1]) {
        transaction.extra_info = [addressMatch[1]];
      } else {
        // Try to extract address from extra_info field
        const extraInfoMatch = text.match(/['"](extra_info)['"]\s*:\s*['"]?(\[.*?\])['"]?/);
        if (extraInfoMatch && extraInfoMatch[2]) {
          try {
            // Clean up the extra_info string and try to parse it
            const cleanExtraInfo = extraInfoMatch[2].replace(/'/g, '"');
            const parsedExtraInfo = JSON.parse(cleanExtraInfo);
            
            // If we have an array with objects, try to extract the 'to' field
            if (Array.isArray(parsedExtraInfo) && parsedExtraInfo.length > 0) {
              if (typeof parsedExtraInfo[0] === 'string' && parsedExtraInfo[0].startsWith('0x')) {
                transaction.extra_info = [parsedExtraInfo[0]];
              } else if (typeof parsedExtraInfo[0] === 'object' && parsedExtraInfo[0].to) {
                transaction.extra_info = [parsedExtraInfo[0].to];
              }
            }
          } catch (e) {
            // Try direct regex extraction from the extra_info string
            const directAddressMatch = extraInfoMatch[2].match(/(0x[a-fA-F0-9]{40})/);
            if (directAddressMatch && directAddressMatch[1]) {
              transaction.extra_info = [directAddressMatch[1]];
            }
          }
        }
      }
      return transaction;
    }
    
    // If not the specific format, try standard JSON parsing
    try {
      const parsed = JSON.parse(text);
      if (parsed) {
        parsed.status = parsed.status || 'pending';
        parsed.timestamp = timestamp;
        return parsed;
      }
    } catch (e) {
      console.log('Direct JSON parse failed, trying alternative methods');
    }
    
    // Try to extract any JSON-like structure
    const jsonMatch = text.match(/\{[^\{\}]*\}/s);
    if (jsonMatch) {
      try {
        // Replace single quotes with double quotes
        const jsonStr = jsonMatch[0].replace(/'/g, '"');
        const parsed = JSON.parse(jsonStr);
        
        // Add required fields
        parsed.action = parsed.action || 'send_transaction';
        parsed.status = 'pending';
        parsed.timestamp = timestamp;
        
        return parsed;
      } catch (e) {
        console.error('Failed to parse extracted JSON:', e);
      }
    }
    
    // Fallback: create a minimal transaction object
    return {
      action: 'send_transaction',
      status: 'pending',
      timestamp: timestamp,
      text: text
    };
  } catch (error) {
    console.error('Error parsing transaction message:', error);
    return {
      action: 'send_transaction',
      error: 'Failed to parse transaction data',
      originalText: text
    };
  }
};

/**
 * Format timestamp to readable time
 * @param {number} timestamp - The timestamp to format
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default {
  parseTransactionMessage,
  formatTime,
  getRiskColor
};
