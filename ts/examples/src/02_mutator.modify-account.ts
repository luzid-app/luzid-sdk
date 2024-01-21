import { AccountModification, Cluster, LuzidSdk } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import { printAccountInfo } from './helpers'

// The account we want to modify
const accountAddr = 'Cbwftr3zwy7pu6XQduj8mFRhnPc6vYEepk1LXMfcAxaD'

async function main() {
  const sdk = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  // 1. Passing no modifications will create the account with defaults if it
  //    didn't exist yet
  {
    // This will assign the program the system program and add enough
    // lamports to make it rent exempt.
    // You can turn this off by passing `false` to `modifyAccount`.
    await sdk.mutator.modifyAccount(AccountModification.forAddr(accountAddr))
    const acc = await conn.getAccountInfo(new web3.PublicKey(accountAddr))
    printAccountInfo(acc)
  }

  // 2. Modify the account data, lamports will be updated automatically to keep
  //    it rent exempt
  {
    await sdk.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr).setData(
        Buffer.from('Hello world! Hola mundo! Hallo Welt!', 'utf8')
      )
    )

    const acc = await conn.getAccountInfo(new web3.PublicKey(accountAddr))
    printAccountInfo(acc)
  }

  // 3. Modify the account owner
  {
    await sdk.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr).setOwner(
        'FQAHqBcVHiiiLP8qXKPDQGr3mEXLv7RSdvfHJ3ZLugBV'
      )
    )

    const acc = await conn.getAccountInfo(new web3.PublicKey(accountAddr))
    printAccountInfo(acc)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
