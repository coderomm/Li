'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import { toast } from 'sonner'
import { createAmmPool } from '../raydiumUtils/createAmmPool'
import Input from './Input'
import { Plus } from 'lucide-react'

export function CreatePoolForm() {
  const { publicKey } = useWallet()
  const [baseToken, setBaseToken] = useState<string>('')
  const [quoteToken, setQuoteToken] = useState<string>('')
  const [baseAmount, setBaseAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('0');
  const [useSOLBalance, setUseSOLBalance] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!publicKey) toast.error('Wallet not connected')
      if (!publicKey) throw new Error('Wallet not connected')

      const baseTokenPubkey = new PublicKey(baseToken)
      const quoteTokenPubkey = new PublicKey(quoteToken)
      const baseAmountBN = new BN(baseAmount)
      const quoteAmountBN = new BN(quoteAmount)
      const startTimeBN = new BN(startTime)

      await createAmmPool({
        baseTokenPubkey,
        quoteTokenPubkey,
        baseAmount: baseAmountBN,
        quoteAmount: quoteAmountBN,
        startTime: startTimeBN,
        ownerInfo: { useSOLBalance }
      })
      toast.success('AMM pool created!')
    } catch (err) {
      console.error(err)
      toast.error((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const wallet = useWallet()
  const { connected } = useWallet();
  useEffect(() => {
    if (connected && wallet.publicKey) {
      toast.success(`connected : ${wallet.publicKey}`)
    } else {
      toast.warning('Not connected')
    }
  }, [connected, wallet.publicKey])

  return (
    <>
      <div className="container mx-auto p-4 md:max-w-3xl">
        <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-60 h-28 bg-fuchsia-500/80 blur-[120px]"></div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl mx-auto">
          <div className='flex flex-col w-full'>
            <label htmlFor="baseToken">Base Mint(Only Token Program)</label>
            <Input
              id="baseToken"
              value={baseToken}
              onChange={(e) => setBaseToken(e.target.value)}
              placeholder="Enter base token address"
              required
            />
            <p className='text-gray-800 text-sm'>Token2022 does not yet support market creation.</p>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="quoteToken">Quote Token Address</label>
            <Input
              id="quoteToken"
              value={quoteToken}
              onChange={(e) => setQuoteToken(e.target.value)}
              placeholder="Enter quote token address"
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="baseAmount">Base Amount</label>
            <Input
              id="baseAmount"
              value={baseAmount}
              onChange={(e) => setBaseAmount(e.target.value)}
              placeholder="Enter base amount"
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="quoteAmount">Quote Amount</label>
            <Input
              id="quoteAmount"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              placeholder="Enter quote amount"
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="startTime">Start Time (in seconds)</label>
            <Input
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Enter start time"
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="useSOLBalance" className="inline-flex items-center">
              <input
                type="checkbox"
                id="useSOLBalance"
                checked={useSOLBalance}
                onChange={(e) => setUseSOLBalance(e.target.checked)}
                className="form-checkbox text-blue-500 w-5 h-5"
              />
              <span className="ml-2">Use SOL Balance for Fees</span>
            </label>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button type='submit' disabled={isLoading || !baseToken || !quoteToken || !baseAmount || !quoteAmount}
            className='mx-auto flex items-center justify-center gap-2 rounded-md py-2 px-5 bg-gradient-to-t bg-gray-900 hover:bg-gray-800 text-white cursor-pointer disabled:pointer-events-none disabled:cursor-none disabled:opacity-70'>
            <Plus className='w-6 h-auto' /> {isLoading ? 'Creating Pool...' : 'Create AMM Pool'}
          </button>
        </form>
      </div>
    </>
  )
}