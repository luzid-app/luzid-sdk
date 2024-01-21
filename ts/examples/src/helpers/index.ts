import * as web3 from '@solana/web3.js'

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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
