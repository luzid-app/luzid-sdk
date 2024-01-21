import { AccountModification, Cluster, LuzidSdk } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import {
  printAccountInfo,
  printSolanaExplorerAccountUrl,
  readKey,
} from './helpers'

// The program accounts we will clone and interact with
const programAddr = 'SoLXmnP9JvL6vJ7TN1VqtTxqsc2izmPfF9CsMDEuRzJ'
const programAccAddr = '5ZspQX4nw95meJHpXBF425NytnNTDgtLBBGVDK9EWmRy'

async function main() {
  const luzid = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  // 1. Clone a Devnet account of the program which is holding a post
  {
    console.log('\nCloning an account of the SolX program from devnet...')

    await luzid.mutator.cloneAccount(Cluster.Devnet, programAccAddr)

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

    await luzid.mutator.cloneAccount(Cluster.Devnet, programAddr)

    const acc = await conn.getAccountInfo(new web3.PublicKey(programAddr))
    printAccountInfo(acc)

    console.log(
      'The program account was cloned and you can refresh the Solana explorer and should see anchor data' +
        ' for the first account we cloned since now it can access its IDL.'
    )
  }

  await readKey()

  // 3. Now for fun let's modify the account data of the first account
  {
    console.log('\nModifying the account data of the first account...')

    const acc = await conn.getAccountInfo(new web3.PublicKey(programAccAddr))

    // Let's upper case the first word
    const data = acc.data
    data[52] = data[52] - 32
    data[53] = data[53] - 32
    data[54] = data[54] - 32
    data[55] = data[55] - 32
    data[56] = data[56] - 32

    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(programAccAddr).setData(data)
    )

    console.log('Refresh the Solana explorer and you should see the change.')
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
