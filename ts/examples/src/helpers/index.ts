import * as web3 from '@solana/web3.js'
import * as readline from 'readline'

export function assert(expr: boolean, message?: string): asserts expr {
  if (!expr) {
    throw new Error(message ?? 'unknown assertion error')
  }
}
export function printAccountInfo(accountInfo: web3.AccountInfo<Buffer>) {
  const { owner, ...rest } = accountInfo
  console.log({
    owner: owner.toBase58(),
    ...rest,
  })
}

export function printSolanaExplorerAccountUrl(accountAddr: string) {
  console.log(
    `https://explorer.solana.com/address/${accountAddr}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
  )
}

export function readKey(): Promise<void> {
  readline.emitKeypressEvents(process.stdin)

  console.log('\nPress any key to continue...')
  if (process.stdin.isTTY) process.stdin.setRawMode(true)

  return new Promise((resolve) => {
    process.stdin.on('keypress', () => {
      resolve()
    })
  })
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
