import { Cluster, LuzidSdk } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import {
  printAccountInfo,
  printSolanaExplorerAccountUrl,
  readKey,
} from './helpers'

// The program account we will clone and interact with
const programAddr = 'SoLXmnP9JvL6vJ7TN1VqtTxqsc2izmPfF9CsMDEuRzJ'
const programAccAddr = '5ZspQX4nw95meJHpXBF425NytnNTDgtLBBGVDK9EWmRy'

async function main() {
  const sdk = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  // 1. Clone a Devnet account of the program which is holding a post
  {
    console.log('\nCloning an account of the SolX program from devnet...')
    await sdk.mutator.cloneAccount(Cluster.Devnet, programAccAddr)
    const acc = await conn.getAccountInfo(new web3.PublicKey(programAccAddr))
    printAccountInfo(acc)

    console.log(
      'The account was cloned. View it in the Solana Explorer at this URL:\n'
    )
    printSolanaExplorerAccountUrl(programAccAddr)
    console.log(
      '\nNotice that it is not showing any anchor data (parsed data) yet.'
    )
  }

  await readKey()

  // 2. Clone the account of the program itself which will auto-clone the IDL account as well
  {
    console.log('\nCloning the SolX program account from devnet...')
    await sdk.mutator.cloneAccount(Cluster.Devnet, programAddr)
    const acc = await conn.getAccountInfo(new web3.PublicKey(programAddr))
    printAccountInfo(acc)

    console.log(
      'The program account was cloned and you can refresh the Solana explorer and should see anchor data' +
        ' for the first account we cloned since now it can access its IDL.'
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
