// Type declarations for JavaScript modules
declare module '*.js' {
  const content: any;
  export default content;
}

// Declare Web3Context module
declare module './context/Web3Context' {
  export interface Web3ContextType {
    isConnected: boolean;
    accounts: string[];
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    selectedChain: string;
    setSelectedChain: (chain: string) => void;
    availableChains: { id: string; name: string }[];
    createTransaction: (to: string, value: string, data?: string) => Promise<string>;
    getTransactionHistory: () => Promise<any[]>;
    isSnapInstalled: boolean;
    installSnap: () => Promise<void>;
    balance: string;
    refreshAccounts: () => Promise<void>;
  }

  export const Web3Provider: React.FC<{ children: React.ReactNode }>;
  export const useWeb3: () => Web3ContextType;
}

// Declare component modules
declare module './components/ChatPage' {
  const ChatPage: React.FC;
  export default ChatPage;
}

declare module './components/AccountsPage' {
  const AccountsPage: React.FC;
  export default AccountsPage;
}

declare module './components/TransactionsPage' {
  const TransactionsPage: React.FC;
  export default TransactionsPage;
}

declare module './components/HistoryPage' {
  const HistoryPage: React.FC;
  export default HistoryPage;
}

declare module './components/SettingsPage' {
  const SettingsPage: React.FC;
  export default SettingsPage;
}

declare module './components/Navbar' {
  const Navbar: React.FC;
  export default Navbar;
}
