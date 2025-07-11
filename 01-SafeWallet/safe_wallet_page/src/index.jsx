import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3Provider } from './context/Web3Context.jsx';

// Import components
import Navbar from './components/Navbar.jsx';
import ChatPage from './components/ChatPage.jsx';
import AccountsPage from './components/AccountsPage.jsx';
import TransactionsPage from './components/TransactionsPage.jsx';
import HistoryPage from './components/HistoryPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';

// Layout component that includes the Navbar and renders child routes
const Layout = ({ children }) => (
  <>
    <div style={{
      position: 'fixed',
      left: '50%',
      top: '50%',
      borderRadius: '16px',
      transform: 'translate(-50%, -50%)',
      maxWidth: '400px', // Standard mobile width
      width: '100%',
      height: '90vh', // Slightly less than full height to provide margin
      marginTop: '0px', // Add some margin at the top
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Optional: adds a subtle shadow
      backgroundColor: 'white', // Optional: ensures background is white
      overflow: 'hidden', // Prevent content from overflowing the container
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto', // Allow vertical scrolling
        overflowX: 'hidden', // Disable horizontal scrolling
        width: '100%'
      }}>
        {children}
      </div>
    </div>
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><ChatPage /></Layout>} />
        <Route path="/accounts" element={<Layout><AccountsPage /></Layout>} />
        <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
        <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </ChakraProvider>
  </React.StrictMode>
);
