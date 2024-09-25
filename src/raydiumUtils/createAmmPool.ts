import { MARKET_STATE_LAYOUT_V3, DEVNET_PROGRAM_ID, } from '@raydium-io/raydium-sdk-v2'
import { initSdk, txVersion } from './config.ts'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import BN from 'bn.js'

export const createAmmPool = async () => {
  const raydium = await initSdk()
  const marketId = new PublicKey(`HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8`)

  const marketBufferInfo = await raydium.connection.getAccountInfo(new PublicKey(marketId))
  const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo!.data)

  const baseMintInfo = await raydium.token.getTokenInfo(baseMint)
  const quoteMintInfo = await raydium.token.getTokenInfo(quoteMint)

  if (
    baseMintInfo.programId !== TOKEN_PROGRAM_ID.toBase58() ||
    quoteMintInfo.programId! == TOKEN_PROGRAM_ID.toBase58()
  ) {
    throw new Error(
      'amm pools with openbook market only support TOKEN_PROGRAM_ID mints, if you want to create pool with token-2022, please create cpmm pool instead'
    )
  }

  const { execute, extInfo } = await raydium.liquidity.createPoolV4({
    programId: DEVNET_PROGRAM_ID.AmmV4, // devnet
    marketInfo: {
      marketId,
      programId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devent
    },
    baseMintInfo: {
      mint: baseMint,
      decimals: baseMintInfo.decimals, // if you know mint decimals here, can pass number directly
    },
    quoteMintInfo: {
      mint: quoteMint,
      decimals: quoteMintInfo.decimals, // if you know mint decimals here, can pass number directly
    },
    baseAmount: new BN(4 * 10 ** 9),
    quoteAmount: new BN(4 * 10 ** 9),
    startTime: new BN(0),
    ownerInfo: {
      useSOLBalance: true,
    },
    associatedOnly: false,
    txVersion,
    feeDestinationId: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID,
  })

  const { txId } = await execute({ sendAndConfirm: true })
  console.log(
    'amm pool created! txId: ',
    txId,
    ', poolKeys:',
    Object.keys(extInfo.address).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
      }),
      {}
    )
  )
}