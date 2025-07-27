"use client";

import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { FaExchangeAlt, FaCog, FaQuestionCircle, FaChevronDown, FaWallet, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import { BiTransfer } from 'react-icons/bi';
import { createNoise3D } from "simplex-noise";
import { useWallet } from '@/contexts/WalletContext';
import type { StaticImageData } from 'next/image';
import xlmLogo from './stellar-xlm-logo.png';
import xrpLogo from './xrp-xrp-logo.png';
import xtarLogo from './xtar.png';
import usdcLogo from './usdc.png';
import arstLogo from './arst.png';


// CoinGecko API types
interface TokenPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

interface TokenData {
  xlm: number;
  xrp: number;
  xlmToXrp: number;
  xrpToXlm: number;
}

interface Token {
  symbol: string;
  name: string;
  logo: string | StaticImageData; // Accept both string and StaticImageData
  price: number;
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: black;
  padding: 20px;
  padding-bottom: 120px; // Logo ve navbar çakışmasın diye
`;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: -100px; /* Sol tarafa ekstra alan */
  width: calc(100vw + 200px); /* Sağ ve sol için ekstra alan */
  height: 100vh;
  z-index: 0;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 48px 40px;
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: 80px; // Navbar'ın hemen üstü
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  filter: brightness(1.5);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
`;

const SettingsButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 16px;
  padding: 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    transform: scale(1.05);
  }
`;

const SettingsPanel = styled.div`
  position: absolute;
  top: 100px;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  min-width: 300px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SettingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
`;

const SettingsButton2 = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SettingsInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 8px 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  width: 70px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ProtocolList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: slideDown 0.3s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProtocolItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const ProtocolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProtocolName = styled.span`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ExternalLink = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    color: #667eea;
  }
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 40px;
  height: 20px;
  background: ${props => props.checked ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    transition: all 0.3s ease;
  }
`;

const SlippageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: slideDown 0.3s ease-out;
`;

const SlippageModeSelector = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ModeButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

const SlippageValueBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  width: 60px;
  min-width: 60px;
`;

const SlippageInput = styled.input`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  width: 60px;
  min-width: 60px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SwapRow = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 40px;
`;

const SwapBox = styled.div<{ color: string }>`
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid ${({ color }) => color}40;
  border-radius: 20px;
  padding: 24px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: ${({ color }) => color}80;
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }
`;

const Label = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TokenLogo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
  }
`;

const TokenName = styled.span`
  font-weight: 600;
  color: white;
  font-size: 1.1rem;
`;

const Amount = styled.input`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  background: transparent;
  outline: none;
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubInfo = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const SwapIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
`;

const SwapIconButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: scale(1.1) rotate(180deg);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }
`;

const SwapButton = styled.button`
  width: 100%;
  padding: 20px 0;
  margin-top: 16px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const WalletButton = styled.button`
  width: 100%;
  padding: 20px 0;
  margin-top: 16px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const DisconnectButton = styled.button`
  width: 100%;
  padding: 16px 0;
  margin-top: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
`;

const TokenSelector = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px;
  margin-top: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideDownFade 0.3s ease-out;
  
  @keyframes slideDownFade {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TokenOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
`;

const TokenSelectorButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 12px 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  max-width: 400px;
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 16px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)' : 'transparent'};
  min-width: 60px;
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const NavText = styled.span<{ $active?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  transition: all 0.3s ease;
  text-align: center;
`;

const BalanceView = styled.div`
  width: 100%;
  margin-top: 20px;
  animation: fadeIn 0.2s ease-in-out;
`;

const SwapView = styled.div`
  width: 100%;
  animation: fadeIn 0.2s ease-in-out;
`;

const PoolsView = styled.div`
  width: 100%;
  animation: fadeIn 0.2s ease-in-out;
`;

const PoolsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
`;

const PoolsSubtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 32px 0;
`;

const NoLiquidityMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;

const AddLiquidityButton = styled.button`
  background: linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 24px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
  }
`;

const BridgeView = styled.div`
  width: 100%;
  animation: fadeIn 0.2s ease-in-out;
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
`;

const NotFoundTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
`;

const NotFoundSubtitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 8px 0;
`;

const NotFoundMessage = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

// Add keyframes for animations
const GlobalStyle = styled.div`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const BalanceTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 16px 0;
`;

const NetworkToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
  gap: 4px;
`;

const ToggleButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)' : 'transparent'};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const TokenTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TokenCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AddressCell = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: monospace;
`;

const TypeCell = styled.div<{ type: 'native' | 'soroban' }>`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${props => props.type === 'native' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  font-weight: 600;
`;

const BalanceCell = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  font-family: monospace;
`;

const MintButton = styled.button`
  background: linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
  }
`;


export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [slippageMode, setSlippageMode] = useState<'auto' | 'custom'>('auto');
  const [customSlippage, setCustomSlippage] = useState('1');
  const [slippageExpanded, setSlippageExpanded] = useState(false);
  const [maxHops, setMaxHops] = useState('2');
  const [protocol, setProtocol] = useState('Soroban');
  const [selectedNetwork, setSelectedNetwork] = useState('testnet');
  const [protocols, setProtocols] = useState({
    sdex: true,
    soroswap: true,
    phoenix: false,
    aqua: true
  });
  const [protocolsExpanded, setProtocolsExpanded] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData>({
    xlm: 0,
    xrp: 0,
    xlmToXrp: 0,
    xrpToXlm: 0
  });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [fromToken, setFromToken] = useState<Token>({ symbol: 'XLM', name: 'Stellar Lumens', logo: xlmLogo, price: 0 });
  const [toToken, setToToken] = useState<Token>({ symbol: 'XRP', name: 'Ripple', logo: xrpLogo, price: 0 });
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);

  // Close token selectors when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.token-selector-container')) {
        setShowFromTokenSelector(false);
        setShowToTokenSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [activeTab, setActiveTab] = useState('swap');
  const [networkType, setNetworkType] = useState<'wrapped' | 'classic'>('classic');

  // Sample balance data
  const balanceData = [
    {
      id: 1,
      token: 'XLM',
      logo: xlmLogo,
      address: 'CDLZ...CYSC',
      type: 'native' as const,
      balance: '19,768.05'
    },
    {
      id: 2,
      token: 'XTAR',
      logo: xtarLogo,
      address: 'XTAR...1234',
      type: 'soroban' as const,
      balance: '0'
    },
    {
      id: 3,
      token: 'USDC',
      logo: usdcLogo,
      address: 'USDC...5678',
      type: 'soroban' as const,
      balance: '0'
    },
    {
      id: 4,
      token: 'XRP',
      logo: xrpLogo,
      address: 'XRP...9012',
      type: 'soroban' as const,
      balance: '0'
    },
    {
      id: 5,
      token: 'ARST',
      logo: arstLogo,
      address: 'ARST...3456',
      type: 'soroban' as const,
      balance: '0'
    }
  ];
  
  const { isConnected, publicKey, connect, disconnect, isLoading } = useWallet();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch prices on component mount
  useEffect(() => {
    fetchTokenPrices();
    
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchTokenPrices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise = createNoise3D();
    let w = window.innerWidth;
    let h = window.innerHeight;
    let nt = 0;

    // Canvas'ı biraz daha büyük yap (ekranın dışına uzansın)
    const extraWidth = 200; // Sağ ve sol için ekstra alan
    canvas.width = w + extraWidth;
    canvas.height = h;

    const waveColors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];

    const render = () => {
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, w + extraWidth, h);
      
      nt += 0.002;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        // Dalgaları ekranın dışına da çiz
        for (let x = -extraWidth/2; x < w + extraWidth/2; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x + extraWidth/2, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
      requestAnimationFrame(render);
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w + extraWidth;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // Available tokens
  const availableTokens: Token[] = [
    { symbol: 'XLM', name: 'Stellar Lumens', logo: xlmLogo, price: tokenData.xlm },
    { symbol: 'XRP', name: 'Ripple', logo: xrpLogo, price: tokenData.xrp }
  ];

  // Handle token selection
  const handleFromTokenSelect = (token: Token) => {
    if (token.symbol === toToken.symbol) {
      // Swap tokens if same token selected
      setToToken(fromToken);
    }
    setFromToken(token);
    setShowFromTokenSelector(false);
    // Recalculate amounts
    if (fromAmount) {
      handleFromAmountChange(fromAmount);
    }
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.symbol === fromToken.symbol) {
      // Swap tokens if same token selected
      setFromToken(toToken);
    }
    setToToken(token);
    setShowToTokenSelector(false);
    // Recalculate amounts
    if (fromAmount) {
      handleFromAmountChange(fromAmount);
    }
  };

  // Handle swap direction
  const handleSwapDirection = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // Swap amounts
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  // Fetch token prices from CoinGecko
  const fetchTokenPrices = async () => {
    try {
      setIsLoadingPrices(true);
      console.log('Fetching prices from CoinGecko...');
      
      // Try alternative endpoint for more accurate prices
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=stellar,ripple&vs_currencies=usd&precision=6'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TokenPrice = await response.json();
      console.log('Raw CoinGecko response:', data);
      
      const xlmPrice = data.stellar?.usd || 0;
      const xrpPrice = data.ripple?.usd || 0;
      
      console.log('Parsed prices:', { xlmPrice, xrpPrice });
      
      // Validate prices are reasonable
      if (xlmPrice < 0.01 || xlmPrice > 10 || xrpPrice < 0.01 || xrpPrice > 10) {
        console.warn('Prices seem unreasonable, using fallback');
        throw new Error('Unreasonable prices received');
      }
      
      // Calculate conversion rates
      const xlmToXrp = xlmPrice > 0 ? xrpPrice / xlmPrice : 0;
      const xrpToXlm = xrpPrice > 0 ? xlmPrice / xrpPrice : 0;
      
      setTokenData({
        xlm: xlmPrice,
        xrp: xrpPrice,
        xlmToXrp,
        xrpToXlm
      });
      
      // Update token prices
      setFromToken(prev => ({ ...prev, price: prev.symbol === 'XLM' ? xlmPrice : xrpPrice }));
      setToToken(prev => ({ ...prev, price: prev.symbol === 'XLM' ? xlmPrice : xrpPrice }));
      
      console.log('Token prices updated:', { xlmPrice, xrpPrice, xlmToXrp, xrpToXlm });
    } catch (error) {
      console.error('Error fetching token prices:', error);
      // Fallback to demo prices
      setTokenData({
        xlm: 0.125,
        xrp: 0.49,
        xlmToXrp: 3.92,
        xrpToXlm: 0.255
      });
    } finally {
      setIsLoadingPrices(false);
    }
  };

  // Calculate amounts based on input
  const calculateAmount = (amount: string, isFrom: boolean) => {
    if (!amount || isNaN(Number(amount))) return '';
    
    const numAmount = Number(amount);
    console.log('Calculating with prices:', { 
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      fromPrice: fromToken.price, 
      toPrice: toToken.price, 
      amount: numAmount, 
      isFrom 
    });
    
    if (isFrom) {
      // Calculate from token to to token using real prices
      const fromValue = numAmount * fromToken.price;
      const toAmount = fromValue / toToken.price;
      console.log('From to To calculation:', { fromValue, toAmount });
      return toAmount.toFixed(2);
    } else {
      // Calculate to token to from token using real prices
      const toValue = numAmount * toToken.price;
      const fromAmount = toValue / fromToken.price;
      console.log('To to From calculation:', { toValue, fromAmount });
      return fromAmount.toFixed(2);
    }
  };

  // Handle amount changes
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    const calculated = calculateAmount(value, true);
    setToAmount(calculated);
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    const calculated = calculateAmount(value, false);
    setFromAmount(calculated);
  };

  // Handle swap button click
  const handleSwap = () => {
    if (!fromAmount || !toAmount) {
      alert('Please enter amounts to swap');
      return;
    }
    
    // Clear inputs after swap
    setFromAmount('');
    setToAmount('');
    
    console.log(`Swapping ${fromAmount} XLM for ${toAmount} XRP`);
    // Here you would implement the actual swap logic
  };

  // Handle navigation tab click
  const handleNavClick = (tab: string) => {
    if (tab === 'info') {
      // Open Dune link in new tab
      window.open('https://dune.com/paltalabs/soroswap', '_blank');
      return;
    }
    
    setActiveTab(tab);
    console.log(`Switched to ${tab} tab`);
    // Here you would implement navigation logic
  };

  return (
    <PageContainer>
      <GlobalStyle />
      <Canvas ref={canvasRef} />
      <GlassCard>
        <Header>
          <Title>
            {activeTab === 'balance' ? 'Balance' : 
             activeTab === 'pools' ? 'Pools' : 
             activeTab === 'bridge' ? 'Bridge' :
             activeTab === 'info' ? 'Info' : 'Swap'}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isConnected && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '0.8rem',
                color: '#4ade80',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: '#4ade80',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                {formatAddress(publicKey || '')}
              </div>
            )}
            <SettingsButton onClick={() => setSettingsOpen(!settingsOpen)}>
              <FaCog size={20} />
            </SettingsButton>
          </div>
        </Header>
        
        {/* Balance View */}
        {activeTab === 'balance' && (
          <BalanceView>
            {isConnected ? (
              <>
                <BalanceTitle>Your token&apos;s balance:</BalanceTitle>
                
                <NetworkToggle>
                  <ToggleButton 
                    active={networkType === 'wrapped'} 
                    onClick={() => setNetworkType('wrapped')}
                  >
                    Wrapped
                  </ToggleButton>
                  <ToggleButton 
                    active={networkType === 'classic'} 
                    onClick={() => setNetworkType('classic')}
                  >
                    Stellar Classic
                  </ToggleButton>
                </NetworkToggle>
                
                <TokenTable>
                  <TableHeader>
                    <div>#</div>
                    <div>Token</div>
                    <div>Address</div>
                    <div>Type</div>
                    <div>Balance</div>
                  </TableHeader>
                  
                  {balanceData.map((token, index) => (
                    <TableRow key={token.id}>
                      <div>{index + 1}</div>
                      <TokenCell>
                        <TokenIcon>
                          <img src={token.logo.src} alt={token.token} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </TokenIcon>
                        {token.token}
                      </TokenCell>
                      <AddressCell>{token.address}</AddressCell>
                      <TypeCell type={token.type}>
                        {token.type === 'native' ? 'Native' : 'Soroban Token'}
                      </TypeCell>
                      <BalanceCell>{token.balance}</BalanceCell>
                    </TableRow>
                  ))}
                </TokenTable>
                
                <MintButton>
                  Mint test tokens
                </MintButton>
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem'
              }}>
                <FaWallet size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <div style={{ marginBottom: '8px', fontWeight: '600' }}>Connect your wallet</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Go to{' '}
                  <span 
                    onClick={() => setActiveTab('swap')}
                    style={{ 
                      color: '#667eea', 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      textDecoration: 'underline'
                    }}
                  >
                    Swap
                  </span>
                  {' '}tab and connect your Stellar wallet to view your token balances
                </div>
              </div>
            )}
          </BalanceView>
        )}
        
        {/* Settings Panel */}
        {settingsOpen && (
          <SettingsPanel>
            <SettingsRow>
              <SettingsLabel>
                Max slippage
                <FaQuestionCircle size={12} />
              </SettingsLabel>
              <SettingsButton2 onClick={() => setSlippageExpanded(!slippageExpanded)}>
                {slippageMode === 'auto' ? 'Auto' : `${customSlippage}%`}
                <FaChevronDown size={10} style={{ transform: slippageExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </SettingsButton2>
            </SettingsRow>
            {slippageExpanded && (
              <SlippageContainer>
                <SlippageModeSelector>
                  <ModeButton 
                    active={slippageMode === 'auto'} 
                    onClick={() => setSlippageMode('auto')}
                  >
                    Auto
                  </ModeButton>
                  <ModeButton 
                    active={slippageMode === 'custom'} 
                    onClick={() => setSlippageMode('custom')}
                  >
                    Custom
                  </ModeButton>
                  {slippageMode === 'auto' ? (
                    <SlippageValueBox>1%</SlippageValueBox>
                  ) : (
                    <SlippageInput
                      type="number"
                      value={customSlippage}
                      onChange={(e) => setCustomSlippage(e.target.value)}
                      min="0.1"
                      max="50"
                      step="0.1"
                    />
                  )}
                </SlippageModeSelector>
              </SlippageContainer>
            )}
            
            <SettingsRow>
              <SettingsLabel>
                Max Hops
                <FaQuestionCircle size={12} />
              </SettingsLabel>
              <SettingsInput 
                type="number" 
                value={maxHops} 
                onChange={(e) => setMaxHops(e.target.value)}
                min="1"
                max="5"
              />
            </SettingsRow>
            
            <SettingsRow>
              <SettingsLabel>
                Protocol
                <FaQuestionCircle size={12} />
              </SettingsLabel>
              <SettingsButton2 onClick={() => setProtocol(protocol === 'Soroban' ? 'Classic' : 'Soroban')}>
                {protocol}
                <FaChevronDown size={10} />
              </SettingsButton2>
            </SettingsRow>
            
            <SettingsRow>
              <SettingsLabel>
                Network
                <FaQuestionCircle size={12} />
              </SettingsLabel>
              <SettingsButton2 onClick={() => setSelectedNetwork(selectedNetwork === 'testnet' ? 'mainnet' : 'testnet')}>
                {selectedNetwork === 'testnet' ? 'Testnet' : 'Mainnet'}
                <FaChevronDown size={10} />
              </SettingsButton2>
            </SettingsRow>
            
            <SettingsRow>
              <SettingsLabel>
                Protocols
                <FaQuestionCircle size={12} />
              </SettingsLabel>
              <SettingsButton2 onClick={() => setProtocolsExpanded(!protocolsExpanded)}>
                {protocolsExpanded ? 'Hide' : 'Show'}
                <FaChevronDown size={10} style={{ transform: protocolsExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </SettingsButton2>
            </SettingsRow>
            {protocolsExpanded && (
              <ProtocolList>
                <ProtocolItem>
                  <ProtocolInfo>
                    <ProtocolName>SDEX</ProtocolName>
                    <ExternalLink>↗</ExternalLink>
                  </ProtocolInfo>
                  <ToggleSwitch 
                    checked={protocols.sdex} 
                    onChange={(e) => setProtocols({...protocols, sdex: e.target.checked})}
                  />
                </ProtocolItem>
                
                <ProtocolItem>
                  <ProtocolInfo>
                    <ProtocolName>Soroswap</ProtocolName>
                    <ExternalLink>↗</ExternalLink>
                  </ProtocolInfo>
                  <ToggleSwitch 
                    checked={protocols.soroswap} 
                    onChange={(e) => setProtocols({...protocols, soroswap: e.target.checked})}
                  />
                </ProtocolItem>
                
                <ProtocolItem>
                  <ProtocolInfo>
                    <ProtocolName>Phoenix</ProtocolName>
                    <ExternalLink>↗</ExternalLink>
                  </ProtocolInfo>
                  <ToggleSwitch 
                    checked={protocols.phoenix} 
                    onChange={(e) => setProtocols({...protocols, phoenix: e.target.checked})}
                  />
                </ProtocolItem>
                
                <ProtocolItem>
                  <ProtocolInfo>
                    <ProtocolName>Aqua</ProtocolName>
                    <ExternalLink>↗</ExternalLink>
                  </ProtocolInfo>
                  <ToggleSwitch 
                    checked={protocols.aqua} 
                    onChange={(e) => setProtocols({...protocols, aqua: e.target.checked})}
                  />
                </ProtocolItem>
              </ProtocolList>
            )}
          </SettingsPanel>
        )}

        {/* Swap View */}
        {activeTab === 'swap' && (
          <SwapView>
            <SwapRow>
          <SwapBox color="#00d4ff" style={{ position: 'relative' }} className="token-selector-container">
            <Label>
              From
            </Label>
            <TokenRow>
              <TokenSelectorButton onClick={() => setShowFromTokenSelector(!showFromTokenSelector)}>
                <TokenLogo>
                  {typeof fromToken.logo === 'string' ? fromToken.logo : <img src={fromToken.logo.src} alt={fromToken.symbol} />}
                </TokenLogo>
                <TokenName>{fromToken.symbol}</TokenName>
                <FaChevronDown size={12} />
              </TokenSelectorButton>
            </TokenRow>
            {showFromTokenSelector && (
              <TokenSelector>
                {availableTokens.map((token) => (
                  <TokenOption key={token.symbol} onClick={() => handleFromTokenSelect(token)}>
                    <TokenLogo>
                      {typeof token.logo === 'string' ? token.logo : <img src={token.logo.src} alt={token.symbol} />}
                    </TokenLogo>
                    <TokenName>{token.symbol}</TokenName>
                  </TokenOption>
                ))}
              </TokenSelector>
            )}
            <Amount 
              type="number" 
              placeholder="0" 
              min="0" 
              step="any"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
            />
            <SubInfo>
              {isLoadingPrices ? 'Loading...' : `~$${(Number(fromAmount) * fromToken.price).toFixed(2)}`}
            </SubInfo>
          </SwapBox>
          <SwapBox color="#23292f" style={{ position: 'relative' }} className="token-selector-container">
            <Label>
              To
            </Label>
            <TokenRow>
              <TokenSelectorButton onClick={() => setShowToTokenSelector(!showToTokenSelector)}>
                <TokenLogo>
                  {typeof toToken.logo === 'string' ? toToken.logo : <img src={toToken.logo.src} alt={toToken.symbol} />}
                </TokenLogo>
                <TokenName>{toToken.symbol}</TokenName>
                <FaChevronDown size={12} />
              </TokenSelectorButton>
            </TokenRow>
            {showToTokenSelector && (
              <TokenSelector>
                {availableTokens.map((token) => (
                  <TokenOption key={token.symbol} onClick={() => handleToTokenSelect(token)}>
                    <TokenLogo>
                      {typeof token.logo === 'string' ? token.logo : <img src={token.logo.src} alt={token.symbol} />}
                    </TokenLogo>
                    <TokenName>{token.symbol}</TokenName>
                  </TokenOption>
                ))}
              </TokenSelector>
            )}
            <Amount 
              type="number" 
              placeholder="0" 
              min="0" 
              step="any"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
            />
            <SubInfo>
              {isLoadingPrices ? 'Loading...' : `~$${(Number(toAmount) * toToken.price).toFixed(2)}`}
            </SubInfo>
          </SwapBox>
        </SwapRow>
        <SwapIconBox>
          <SwapIconButton onClick={handleSwapDirection}>
            <FaExchangeAlt size={24} color="white" />
          </SwapIconButton>
        </SwapIconBox>
        
        {isConnected ? (
          <>
            <SwapButton onClick={handleSwap}>Swap</SwapButton>
            <DisconnectButton onClick={disconnect}>
              <FaSignOutAlt size={16} />
              Disconnect Wallet
            </DisconnectButton>
          </>
        ) : (
          <WalletButton onClick={connect} disabled={isLoading}>
            <FaWallet size={20} />
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </WalletButton>
        )}
          </SwapView>
        )}

                 {/* Pools View */}
         {activeTab === 'pools' && (
           <PoolsView>
             {isConnected ? (
               <>
                 <PoolsTitle>Your liquidity</PoolsTitle>
                 <PoolsSubtitle>List of your liquidity positions</PoolsSubtitle>
                 <NoLiquidityMessage>
                   No liquidity found.
                 </NoLiquidityMessage>
                 <AddLiquidityButton>
                   + Add Liquidity
                 </AddLiquidityButton>
               </>
             ) : (
               <div style={{ 
                 textAlign: 'center', 
                 padding: '40px 20px',
                 color: 'rgba(255, 255, 255, 0.7)',
                 fontSize: '1.1rem'
               }}>
                 <FaQuestionCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                 <div style={{ marginBottom: '8px', fontWeight: '600' }}>Connect your wallet</div>
                 <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                   Go to{' '}
                   <span 
                     onClick={() => setActiveTab('swap')}
                     style={{ 
                       color: '#667eea', 
                       cursor: 'pointer', 
                       fontWeight: '600',
                       textDecoration: 'underline'
                     }}
                   >
                     Swap
                   </span>
                   {' '}tab and connect your Stellar wallet to view your liquidity positions
                 </div>
               </div>
             )}
           </PoolsView>
         )}

         {/* Bridge View */}
         {activeTab === 'bridge' && (
           <BridgeView>
             <NotFoundContainer>
               <NotFoundTitle>404</NotFoundTitle>
               <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
               <NotFoundMessage>The page you are looking for does not exist.</NotFoundMessage>
             </NotFoundContainer>
           </BridgeView>
         )}

         
      </GlassCard>

      <LogoContainer>
        <Logo src="/soroswap-logo.svg" alt="Soroswap" />
      </LogoContainer>

      <BottomNavigation>
        <NavItem $active={activeTab === 'balance'} onClick={() => handleNavClick('balance')}>
          <FaWallet size={20} />
          <NavText $active={activeTab === 'balance'}>Balance</NavText>
        </NavItem>
        <NavItem $active={activeTab === 'swap'} onClick={() => handleNavClick('swap')}>
          <FaExchangeAlt size={20} />
          <NavText $active={activeTab === 'swap'}>Swap</NavText>
        </NavItem>
        <NavItem $active={activeTab === 'pools'} onClick={() => handleNavClick('pools')}>
          <FaQuestionCircle size={20} />
          <NavText $active={activeTab === 'pools'}>Pools</NavText>
        </NavItem>
        <NavItem $active={activeTab === 'bridge'} onClick={() => handleNavClick('bridge')}>
          <BiTransfer size={20} />
          <NavText $active={activeTab === 'bridge'}>Bridge</NavText>
        </NavItem>
        <NavItem $active={activeTab === 'info'} onClick={() => handleNavClick('info')}>
          <FaInfoCircle size={20} />
          <NavText $active={activeTab === 'info'}>Info</NavText>
        </NavItem>
      </BottomNavigation>
    </PageContainer>
  );
}
