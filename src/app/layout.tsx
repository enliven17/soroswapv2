import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";

export const metadata: Metadata = {
  title: "Soroswap",
  description: "Modern cryptocurrency swap interface",
  icons: {
    icon: '/soroswap-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Freighter API
              window.addEventListener('load', function() {
                console.log('Page loaded, checking for Freighter...');
                
                // Wait a bit for Freighter to load
                setTimeout(function() {
                  if (typeof window !== 'undefined') {
                    console.log('Checking Freighter availability...');
                    console.log('window.freighterApi:', window.freighterApi);
                    console.log('window.freighter:', window.freighter);
                    
                    // Try to access Freighter via different methods
                    if (window.freighterApi) {
                      console.log('Freighter API found at window.freighterApi');
                    } else if (window.freighter) {
                      console.log('Freighter API found at window.freighter');
                    } else {
                      console.log('Freighter not found, checking for extension...');
                      
                      // Check if Freighter extension is installed
                      if (window.navigator.userAgent.includes('Chrome') || window.navigator.userAgent.includes('Firefox')) {
                        console.log('Browser supports extensions');
                        
                        // Try to detect Freighter extension
                        if (document.querySelector('link[href*="freighter"]')) {
                          console.log('Freighter extension detected via link');
                        }
                      }
                    }
                  }
                }, 1000);
              });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
