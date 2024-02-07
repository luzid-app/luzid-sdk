import { AccountModification, Cluster, LuzidSdk } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import * as c from 'ansi-colors'
import { assert, printAccountInfo } from './helpers'

// The account we want to modify
const accountAddr = 'Cbwftr3zwy7pu6XQduj8mFRhnPc6vYEepk1LXMfcAxaD'

async function main() {
  const luzid = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  // 1. Passing no modifications will create the account with defaults if it
  //    didn't exist yet
  {
    console.log(c.bold('\n1. Initial modification to create account...'))

    // This will assign the account to the system program and add enough
    // lamports to make it rent exempt.
    // You can turn this off by passing `false` to `modifyAccount`.
    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr),
      { commitment: 'confirmed' }
    )

    const acc = await conn.getAccountInfo(new web3.PublicKey(accountAddr))
    printAccountInfo(acc)

    assert(
      acc.owner.equals(web3.SystemProgram.programId),
      'owner is system program'
    )
    assert(acc.lamports > 800000, 'lamports > 800000')
    assert(acc.data.length === 0, 'data is empty')
  }

  // 2. Modify the account data, lamports will be updated automatically to keep
  //    it rent exempt
  {
    console.log(c.bold('\n2. Modifying account data...'))

    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr).setData(
        Buffer.from('Hello world! Hola mundo! Hallo Welt!', 'utf8')
      ),
      { commitment: 'confirmed' }
    )

    const acc = await conn.getAccountInfo(new web3.PublicKey(accountAddr))
    printAccountInfo(acc)

    console.log(
      c.dim.italic(
        'Note that the lamports were updated to keep the account rent exempt.'
      )
    )

    assert(
      acc.owner.equals(web3.SystemProgram.programId),
      'owner is still system program'
    )
    assert(acc.lamports > 1000000, 'lamports > 1000000')
    assert(acc.data.length >= 36, 'data was updated')
  }

  // 3. Modify the account owner
  {
    const owner = 'FQAHqBcVHiiiLP8qXKPDQGr3mEXLv7RSdvfHJ3ZLugBV'
    console.log(c.bold('\n3. Modifying account owner...'))

    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr).setOwner(owner),
      { commitment: 'confirmed' }
    )

    const acc = await conn.getAccountInfo(new web3.PublicKey(accountAddr))
    printAccountInfo(acc)

    assert(acc.owner.equals(new web3.PublicKey(owner)), 'owner was updated')
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
