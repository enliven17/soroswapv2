# Soroswap v2 - UI/UX Improvement

A redesigned user interface for Soroswap, the Stellar-based decentralized exchange. This project implements a glassmorphism design system with wallet integration and tabbed navigation.

## 🚀 Features

### **Design System**
- **Glassmorphism UI**: Frosted glass effects with backdrop blur
- **Dynamic Background**: Animated wavy background using HTML Canvas and Simplex Noise
- **Responsive Layout**: Works on all screen sizes
- **Tab Transitions**: Animated switching between views

### **Wallet Integration**
- **Stellar Wallet Kit**: Multi-wallet support
- **Single-Screen Experience**: Connect wallet in the swap interface
- **Connection Status**: Real-time wallet state feedback
- **Network Toggle**: Testnet and Mainnet support

### **Swap Interface**
- **Real-time Pricing**: XLM/XRP prices from CoinGecko API
- **Token Selection**: Dropdowns for XLM and XRP
- **Price Calculations**: Conversion rates and USD values
- **Token Logos**: Visual token identification
- **Swap Direction**: Token swapping with arrow button

### **Navigation**
- **Bottom Navigation**: Island-style navigation bar
- **Multiple Views**: Swap, Balance, Pools, Bridge, and Info tabs
- **Tab Switching**: Animated transitions
- **Contextual Views**: Different content based on wallet connection

### **Balance Management**
- **Asset Overview**: Wallet balance display
- **Token Table**: Organized holdings view
- **Network Toggle**: Native and Soroban token switching
- **Balance Updates**: Real-time tracking

### **Liquidity Pools**
- **Pool Information**: Current liquidity positions
- **Add Liquidity**: Liquidity provision access
- **Pool Data**: Pool metrics display

### **Settings & Configuration**
- **Slippage Control**: Auto and custom slippage
- **Protocol Selection**: Soroban and Classic options
- **Network Settings**: Testnet/Mainnet configuration
- **Max Hops**: Routing configuration

## 🛠️ Technologies

### **Frontend Framework**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Styled Components**: Component-scoped CSS

### **Wallet Integration**
- **@creit.tech/stellar-wallets-kit**: Multi-wallet support
- **Freighter API**: Browser extension integration
- **Stellar SDK**: Blockchain interactions

### **Data & APIs**
- **CoinGecko API**: Cryptocurrency prices
- **REST APIs**: External data fetching
- **WebSocket**: Real-time updates (planned)

### **Styling & Animation**
- **HTML Canvas**: Background animation
- **Simplex Noise**: Wave generation
- **CSS Animations**: Transitions and effects
- **Glassmorphism**: UI design patterns

### **Development Tools**
- **Vercel**: Deployment platform
- **ESLint**: Code quality
- **Prettier**: Code formatting

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main application page
├── contexts/              # React Context providers
│   └── WalletContext.tsx  # Wallet state management
├── components/            # Reusable components
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions

public/
├── soroswap-logo.svg      # Application logo
└── app/                   # Token logo assets
    ├── xlm.png
    ├── xrp.png
    ├── xtar.png
    ├── usdc.png
    └── arst.png
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Purple gradients (#667eea, #764ba2)
- **Background**: Dark theme with glassmorphism
- **Text**: White and light gray
- **Accents**: Blue and purple for interactions

### **Typography**
- **Headers**: Bold sans-serif
- **Body**: Readable fonts
- **Interactive**: Color and weight highlighting

### **Components**
- **Glass Cards**: Frosted glass with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Minimal design with focus states
- **Navigation**: Island-style bottom bar

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Stellar wallet (Freighter recommended)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soroswapv2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### **Environment Variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

## 🔧 Configuration

### **Wallet Setup**
1. Install Freighter browser extension
2. Create or import a Stellar wallet
3. Connect wallet through the interface

### **Network Selection**
- **Testnet**: For development and testing
- **Mainnet**: For real transactions

### **Slippage Settings**
- **Auto**: 1% default slippage
- **Custom**: User-defined slippage (0.1% - 50%)

## 📱 Usage

### **Swapping Tokens**
1. Connect your Stellar wallet
2. Select "From" token (XLM or XRP)
3. Enter amount to swap
4. Select "To" token
5. Review conversion rate and fees
6. Click "Swap" to execute

### **Viewing Balances**
1. Navigate to "Balance" tab
2. Toggle between Native and Soroban tokens
3. View all wallet assets in organized table

### **Managing Pools**
1. Go to "Pools" tab
2. View current liquidity positions
3. Add new liquidity or manage existing

### **Settings**
1. Click settings icon (gear)
2. Configure slippage, protocols, and network
3. Click outside to close settings panel

## 🌟 Key Improvements

### **User Experience**
- **Navigation**: Clear, accessible interface
- **Feedback**: Real-time updates and status
- **Error Handling**: Graceful error states
- **Loading States**: Loading animations

### **Performance**
- **Rendering**: Efficient component updates
- **Lazy Loading**: On-demand component loading
- **Caching**: API response caching
- **Bundle Size**: Optimized bundle

### **Accessibility**
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **Color Contrast**: High contrast ratios
- **Focus Management**: Clear focus indicators

## 🔮 Future Enhancements

### **Planned Features**
- **Mobile App**: React Native version
- **Charts**: Trading view integration
- **Notifications**: Real-time alerts
- **Theme Switching**: Dark/Light mode
- **Internationalization**: Multi-language support

### **Technical Improvements**
- **WebSocket**: Real-time price updates
- **Offline Support**: Service worker implementation
- **PWA**: Progressive web app features
- **Analytics**: User behavior tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Style**
- Follow TypeScript best practices
- Use styled-components for styling
- Maintain component reusability
- Add proper documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Soroswap Team**: Original DEX implementation
- **Stellar Development Foundation**: Blockchain infrastructure
- **CoinGecko**: Price data API
- **Vercel**: Deployment platform

## 📞 Support

For support and questions:
- **Issues**: GitHub Issues
- **Discord**: Soroswap Community
- **Documentation**: [Soroswap Docs](https://docs.soroswap.finance)

---

**Built with ❤️ for the Stellar ecosystem**
