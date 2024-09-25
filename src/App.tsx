'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { CreatePoolForm } from './CreatePoolForm.tsx'
import { WalletContextProvider } from './WalletContextProvider.tsx'

export default function App() {
  const { connected } = useWallet()
  const [poolCreated, setPoolCreated] = useState(false)

  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">Raydium AMM Pool Creator</h1>
        <WalletMultiButton className="mb-4" />
        {connected && !poolCreated && (
          <CreatePoolForm onPoolCreated={() => setPoolCreated(true)} />
        )}
        {poolCreated && (
          <div className="text-green-600 font-semibold">
            Pool created successfully!
          </div>
        )}
      </div>
    </WalletContextProvider>
  )
}