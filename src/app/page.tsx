"use client";

import styled from 'styled-components';
import { useState } from 'react';
import { FaExchangeAlt, FaCog, FaQuestionCircle, FaChevronDown } from 'react-icons/fa';
import { Waves } from '@/components/ui/waves-background';

const PageBg = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(120deg, #f8fafc 0%, #e9eafc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
`;

const WavesContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 40px 32px;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #222;
  margin: 0;
`;

const SettingsButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  padding: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #333;
  }
`;

const SettingsPanel = styled.div`
  position: absolute;
  top: 80px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 50;
`;

const SettingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
`;

const SettingsButton2 = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SettingsInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  width: 60px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #6b7cff;
  }
`;

const SwapRow = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin-bottom: 32px;
`;

const SwapBox = styled.div<{ color: string }>`
  flex: 1;
  background: rgba(255,255,255,0.6);
  border: 2px solid ${({ color }) => color};
  border-radius: 16px;
  padding: 20px 18px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TokenLogo = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const TokenName = styled.span`
  font-weight: 600;
  color: #222;
`;

const Amount = styled.input`
  width: 100%;
  font-size: 1.3rem;
  font-weight: 600;
  border: none;
  background: transparent;
  outline: none;
  color: #23243a;
`;

const SubInfo = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const SwapIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
`;

const SwapButton = styled.button`
  width: 100%;
  padding: 18px 0;
  margin-top: 8px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(90deg, #23243a 0%, #3b3c5a 100%);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.10);
  transition: background 0.2s;
  
  &:hover {
    background: linear-gradient(90deg, #3b3c5a 0%, #23243a 100%);
  }
`;

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [maxSlippage, setMaxSlippage] = useState('Auto');
  const [maxHops, setMaxHops] = useState('2');
  const [protocol, setProtocol] = useState('Soroban');

  return (
    <PageBg>
      <WavesContainer>
        <Waves
          lineColor="rgba(59, 130, 246, 0.3)"
          backgroundColor="transparent"
          waveSpeedX={0.015}
          waveSpeedY={0.008}
          waveAmpX={60}
          waveAmpY={30}
          friction={0.92}
          tension={0.008}
          maxCursorMove={150}
          xGap={8}
          yGap={24}
        />
      </WavesContainer>
      <GlassCard>
        <Header>
          <Title>Swap</Title>
          <SettingsButton onClick={() => setSettingsOpen(!settingsOpen)}>
            <FaCog size={20} />
          </SettingsButton>
        </Header>
        
        {/* Settings Panel */}
        {settingsOpen && (
          <SettingsPanel>
            <SettingsRow>
              <SettingsLabel>
                Max slippage
                <FaQuestionCircle size={12} />
              </SettingsLabel>
              <SettingsButton2 onClick={() => setMaxSlippage(maxSlippage === 'Auto' ? 'Manual' : 'Auto')}>
                {maxSlippage}
                <FaChevronDown size={10} />
              </SettingsButton2>
            </SettingsRow>
            
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
          </SettingsPanel>
        )}

        <SwapRow>
          <SwapBox color="#f6b85c">
            <Label>
              From
            </Label>
            <TokenRow>
              <TokenLogo>₿</TokenLogo>
              <TokenName>BTC</TokenName>
            </TokenRow>
            <Amount type="number" placeholder="1" min="0" step="any" />
            <SubInfo>~66,625.78</SubInfo>
          </SwapBox>
          <SwapBox color="#6b7cff">
            <Label>
              To
            </Label>
            <TokenRow>
              <TokenLogo>Ξ</TokenLogo>
              <TokenName>ETH</TokenName>
            </TokenRow>
            <Amount type="number" placeholder="19.265" min="0" step="any" />
            <SubInfo>~66,422.78</SubInfo>
          </SwapBox>
        </SwapRow>
        <SwapIconBox>
          <FaExchangeAlt size={28} color="#bbb" />
        </SwapIconBox>
        <SwapButton>Swap</SwapButton>
      </GlassCard>
    </PageBg>
  );
}
