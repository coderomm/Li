'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { createAmmPool } from './raydiumUtils/createAmmPool'

interface CreatePoolFormProps {
  onPoolCreated: () => void
}

export function CreatePoolForm({ onPoolCreated }: CreatePoolFormProps) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [baseToken, setBaseToken] = useState<string>('')
  const [quoteToken, setQuoteToken] = useState<string>('')
  const [baseAmount, setBaseAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('0');
  const [useSOLBalance, setUseSOLBalance] = useState<boolean>(true);
  const [initialLiquidity, setInitialLiquidity] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wallet = useWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!publicKey) throw new Error('Wallet not connected')

      const baseTokenPubkey = new PublicKey(baseToken)
      const quoteTokenPubkey = new PublicKey(quoteToken)
      const liquidity = parseFloat(initialLiquidity)

      await createAmmPool(connection, publicKey, baseTokenPubkey, quoteTokenPubkey, liquidity, sendTransaction)         
      onPoolCreated()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="baseToken">Base Token Address</label>
        <input
          id="baseToken"
          value={baseToken}
          onChange={(e) => setBaseToken(e.target.value)}
          placeholder="Enter base token address"
          required
        />
      </div>
      <div>
        <label htmlFor="quoteToken">Quote Token Address</label>
        <input
          id="quoteToken"
          value={quoteToken}
          onChange={(e) => setQuoteToken(e.target.value)}
          placeholder="Enter quote token address"
          required
        />
      </div>
      <div>
        <label htmlFor="initialLiquidity">Initial Liquidity</label>
        <input
          id="initialLiquidity"
          type="number"
          value={initialLiquidity}
          onChange={(e) => setInitialLiquidity(e.target.value)}
          placeholder="Enter initial liquidity amount"
          required
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Pool...' : 'Create AMM Pool'}
      </button>
    </form>
  )
}