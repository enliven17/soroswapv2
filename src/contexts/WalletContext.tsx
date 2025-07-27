"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID,
  ISupportedWallet
} from '@creit.tech/stellar-wallets-kit';

interface WalletContextType {
  isConnected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  network: 'testnet' | 'public';
  setNetwork: (network: 'testnet' | 'public') => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState<'testnet' | 'public'>('testnet');
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);

  // Initialize Stellar Wallets Kit
  useEffect(() => {
    const initKit = async () => {
      try {
        const stellarKit = new StellarWalletsKit({
          network: network === 'testnet' ? WalletNetwork.TESTNET : WalletNetwork.PUBLIC,
          selectedWalletId: XBULL_ID,
          modules: allowAllModules(),
        });
        
        setKit(stellarKit);
        console.log('Stellar Wallets Kit initialized');
      } catch (error) {
        console.error('Failed to initialize Stellar Wallets Kit:', error);
      }
    };

    initKit();
  }, [network]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('walletPublicKey');
    const savedNetwork = localStorage.getItem('walletNetwork') as 'testnet' | 'public';
    
    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
    
    if (savedPublicKey) {
      setPublicKey(savedPublicKey);
      setIsConnected(true);
    }
  }, []);

  const connect = async () => {
    if (!kit) {
      console.error('Stellar Wallets Kit not initialized');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Opening wallet selector modal...');
      
      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          console.log('Wallet selected:', option);
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          setPublicKey(address);
          setIsConnected(true);
          localStorage.setItem('walletPublicKey', address);
          localStorage.setItem('walletNetwork', network);
          console.log('Wallet connected successfully:', address);
        },
        onClosed: (err) => {
          if (err) {
            console.error('Modal closed with error:', err);
          } else {
            console.log('Modal closed');
          }
        },
        modalTitle: 'Connect Your Stellar Wallet',
        notAvailableText: 'No wallets available'
      });
      
    } catch (error) {
      console.error('Failed to open wallet modal:', error);
      alert('Failed to open wallet selector. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      if (kit) {
        await kit.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      setIsConnected(false);
      setPublicKey(null);
      localStorage.removeItem('walletPublicKey');
      localStorage.removeItem('walletNetwork');
    }
  };

  const handleNetworkChange = (newNetwork: 'testnet' | 'public') => {
    setNetwork(newNetwork);
    localStorage.setItem('walletNetwork', newNetwork);
    
    // Disconnect if connected when changing networks
    if (isConnected) {
      disconnect();
    }
  };

  const value: WalletContextType = {
    isConnected,
    publicKey,
    connect,
    disconnect,
    isLoading,
    network,
    setNetwork: handleNetworkChange,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 