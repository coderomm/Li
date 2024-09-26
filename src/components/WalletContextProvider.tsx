'use client'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { Toaster } from 'sonner';

import '@solana/wallet-adapter-react-ui/styles.css'
import Header from '../ui/Header';
import Footer from '../ui/Footer';

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const network = 'devnet'
  const endpoint = clusterApiUrl(network)

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}