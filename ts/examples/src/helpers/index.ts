import * as web3 from '@solana/web3.js'
import * as readline from 'readline'
import * as c from 'ansi-colors'

export function assert(expr: boolean, message?: string): asserts expr {
  if (!expr) {
    throw new Error(message ?? 'unknown assertion error')
  }
}
export function printAccountInfo(
  accountInfo: web3.AccountInfo<Buffer>,
  opts?: { includeData?: boolean }
) {
  const { includeData = false } = opts ?? {}
  const { owner, data, ...rest } = accountInfo

  console.log({
    owner: owner.toBase58(),
    data: includeData ? data.toString() : `<${data.length} bytes>`,
    ...rest,
  })
}

export function printSolanaExplorerAccountUrl(
  accountAddr: string,
  opts?: { tab?: string }
) {
  const { tab = null } = opts ?? {}
  let url = `https://explorer.solana.com/address/${accountAddr}`
  if (tab != null) url += `/${tab}`
  console.log(
    c.bold.underline.blue(
      `${url}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
    )
  )
}

export function readKey(): Promise<void> {
  readline.emitKeypressEvents(process.stdin)

  console.log(c.gray('\nPress any key to continue...'))
  if (process.stdin.isTTY) process.stdin.setRawMode(true)

  if (process.env.CI != null) return Promise.resolve()

  return new Promise((resolve) => {
    process.stdin.on('keypress', () => {
      resolve()
    })
  })
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
