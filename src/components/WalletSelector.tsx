"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  description: string;
}

const wallets: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter',
    icon: '🔐',
    available: true,
    description: 'Browser extension wallet'
  },
  {
    id: 'albedo',
    name: 'Albedo',
    icon: '🔷',
    available: true,
    description: 'Web-based wallet'
  },
  {
    id: 'xbull',
    name: 'xBull',
    icon: '🐂',
    available: true,
    description: 'Mobile wallet'
  },
  {
    id: 'hot',
    name: 'HOT Wallet',
    icon: '🔥',
    available: true,
    description: 'Hardware wallet'
  },
  {
    id: 'rabet',
    name: 'Rabet',
    icon: '🐰',
    available: false,
    description: 'Browser extension (coming soon)'
  },
  {
    id: 'lobstr',
    name: 'LOBSTR',
    icon: '🌊',
    available: false,
    description: 'Mobile wallet (coming soon)'
  },
  {
    id: 'hana',
    name: 'Hana Wallet',
    icon: '🌸',
    available: false,
    description: 'Mobile wallet (coming soon)'
  }
];

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled.div`
  background: rgba(30, 30, 30, 0.95);
  border-radius: 24px;
  padding: 0;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 32px;
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const RightSection = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

const InfoTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WalletItem = styled.div<{ available: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: ${props => props.available ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.available ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  transition: all 0.2s;
  opacity: ${props => props.available ? 1 : 0.5};
  
  &:hover {
    background: ${props => props.available ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
    transform: ${props => props.available ? 'translateY(-1px)' : 'none'};
  }
`;

const WalletIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
`;

const WalletInfo = styled.div`
  flex: 1;
`;

const WalletName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
`;

const WalletDescription = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
`;

const WalletStatus = styled.div<{ available: boolean }>`
  color: ${props => props.available ? '#4ade80' : 'rgba(255, 255, 255, 0.4)'};
  font-size: 0.8rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${props => props.available ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
`;

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => void;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  isOpen,
  onClose,
  onSelectWallet
}) => {
  const handleWalletSelect = (wallet: WalletOption) => {
    if (wallet.available) {
      onSelectWallet(wallet.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Connect a Wallet</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <LeftSection>
            <InfoTitle>What is a wallet?</InfoTitle>
            <InfoText>
              Wallets are used to send, receive, and store the keys you use to sign blockchain transactions.
            </InfoText>
            
            <InfoTitle>What is Stellar?</InfoTitle>
            <InfoText>
              Stellar is a decentralized, public blockchain that gives developers the tools to create experiences that are more like cash than crypto.
            </InfoText>
          </LeftSection>
          
          <RightSection>
            <WalletList>
              {wallets.map((wallet) => (
                <WalletItem
                  key={wallet.id}
                  available={wallet.available}
                  onClick={() => handleWalletSelect(wallet)}
                >
                  <WalletIcon>{wallet.icon}</WalletIcon>
                  <WalletInfo>
                    <WalletName>{wallet.name}</WalletName>
                    <WalletDescription>{wallet.description}</WalletDescription>
                  </WalletInfo>
                  <WalletStatus available={wallet.available}>
                    {wallet.available ? 'Available' : 'Not available'}
                  </WalletStatus>
                </WalletItem>
              ))}
            </WalletList>
          </RightSection>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 