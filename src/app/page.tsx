import styled from 'styled-components';
import { FaExchangeAlt } from 'react-icons/fa';

const PageBg = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #f8fafc 0%, #e9eafc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 32px;
  color: #222;
  align-self: flex-start;
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
  return (
    <PageBg>
      <GlassCard>
        <Title>Exchange</Title>
        <SwapRow>
          <SwapBox color="#f6b85c">
            <Label>
              From
              {/* Token seçici placeholder */}
            </Label>
            <TokenRow>
              <TokenLogo>₿</TokenLogo>
              <TokenName>BTC</TokenName>
            </TokenRow>
            <Amount type="number" placeholder="1" />
            <SubInfo>~66,625.78</SubInfo>
          </SwapBox>
          <SwapBox color="#6b7cff">
            <Label>
              To
              {/* Token seçici placeholder */}
            </Label>
            <TokenRow>
              <TokenLogo>Ξ</TokenLogo>
              <TokenName>ETH</TokenName>
            </TokenRow>
            <Amount type="number" placeholder="19.265" />
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
