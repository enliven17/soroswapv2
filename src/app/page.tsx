"use client";

import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { FaExchangeAlt, FaCog, FaQuestionCircle, FaChevronDown } from 'react-icons/fa';
import { createNoise3D } from "simplex-noise";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: black;
  padding: 20px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [maxSlippage, setMaxSlippage] = useState('Auto');
  const [maxHops, setMaxHops] = useState('2');
  const [protocol, setProtocol] = useState('Soroban');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <PageContainer>
      <Canvas ref={canvasRef} />
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
          <SwapIconButton>
            <FaExchangeAlt size={24} color="white" />
          </SwapIconButton>
        </SwapIconBox>
        <SwapButton>Swap</SwapButton>
      </GlassCard>
    </PageContainer>
  );
}
