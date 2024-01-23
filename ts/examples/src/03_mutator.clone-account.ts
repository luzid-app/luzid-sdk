import { AccountModification, Cluster, LuzidSdk } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import * as c from 'ansi-colors'
import {
  assert,
  printAccountInfo,
  printSolanaExplorerAccountUrl,
  readKey,
} from './helpers'

// The program accounts we will clone and interact with
const programAddr = 'SoLXmnP9JvL6vJ7TN1VqtTxqsc2izmPfF9CsMDEuRzJ'
const postAddr = '5ZspQX4nw95meJHpXBF425NytnNTDgtLBBGVDK9EWmRy'

const BPF_LOADER_UPGRADABLE_PROGRAM_ID = new web3.PublicKey(
  'BPFLoaderUpgradeab1e11111111111111111111111'
)

async function main() {
  const luzid = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  // 1. Clone a Devnet account of the program which is holding a post
  {
    console.log(
      c.bold('\n1. Cloning an account of the SolX program from devnet...')
    )

    await luzid.mutator.cloneAccount(Cluster.Devnet, postAddr)

    const acc = await conn.getAccountInfo(new web3.PublicKey(postAddr))
    printAccountInfo(acc)

    console.log(
      '\nThe account was cloned. View it in the Solana Explorer at this URL:\n'
    )
    printSolanaExplorerAccountUrl(postAddr, { tab: 'anchor-account' })
    console.log(
      c.dim.italic(
        '\nNotice that it is not showing any anchor data (parsed data) yet.'
      )
    )

    // Assertions (you can safely ignore these)
    {
      assert(
        acc.owner.equals(new web3.PublicKey(programAddr)),
        'owner is solx program'
      )

      assert(acc.lamports > 9000000, 'lamports > 9000000')
      assert(acc.data.length >= 1000, 'data was cloned')
    }
  }

  await readKey()

  // 2. Clone the account of the program itself which will auto-clone the IDL account as well
  {
    console.log(c.bold('\n2. Cloning the SolX program account from devnet...'))

    await luzid.mutator.cloneAccount(Cluster.Devnet, programAddr)

    const programAcc = await conn.getAccountInfo(
      new web3.PublicKey(programAddr)
    )
    printAccountInfo(programAcc)

    console.log(
      c.italic.dim(
        'The program account was cloned and you can refresh the Solana explorer and should see anchor data' +
          ' for the first account we cloned since now it can access its IDL.'
      )
    )

    // Assertions (you can safely ignore these)
    {
      // Assert the program account itself was properly cloned
      assert(programAcc.lamports > 1000000, 'lamports > 1000000')
      assert(programAcc.data.length >= 36, 'data was cloned')
      assert(
        programAcc.owner.equals(BPF_LOADER_UPGRADABLE_PROGRAM_ID),
        'owner is bpf loader upgradable'
      )
      assert(programAcc.executable, 'executable')

      // Assert the account holding the executable data was properly cloned
      const execDataAddr = 'J1ct2BY6srXCDMngz5JxkX3sHLwCqGPhy9FiJBc8nuwk'
      const execDataAcc = await conn.getAccountInfo(
        new web3.PublicKey(execDataAddr)
      )

      assert(execDataAcc.lamports > 2000000000, 'lamports > 2000000000')
      assert(execDataAcc.data.length >= 400000, 'data was cloned')
      assert(
        execDataAcc.owner.equals(BPF_LOADER_UPGRADABLE_PROGRAM_ID),
        'owner is bpf loader upgradable'
      )
      assert(!execDataAcc.executable, 'not executable')

      // Assert the account holding the IDL was properly cloned
      const idlAddr = 'EgrsyMAsGYMKjcnTvnzmpJtq3hpmXznKQXk21154TsaS'
      const idlAcc = await conn.getAccountInfo(new web3.PublicKey(idlAddr))

      assert(idlAcc.lamports > 6000000, 'lamports > 6000000')
      assert(idlAcc.data.length >= 700, 'data was cloned')
      assert(
        idlAcc.owner.equals(new web3.PublicKey(programAddr)),
        'owner is solx program'
      )
      assert(!execDataAcc.executable, 'not executable')
    }
  }

  await readKey()

  // 3. Now for fun let's modify the account data of the first account we cloned
  {
    console.log(
      c.bold('\n3. Modifying the account data of the first account...')
    )

    const acc = await conn.getAccountInfo(new web3.PublicKey(postAddr))

    // Let's UPPER CASE the first word (the message starts at offset 52)
    const data = acc.data
    data[52] = data[52] - 32
    data[53] = data[53] - 32
    data[54] = data[54] - 32
    data[55] = data[55] - 32
    data[56] = data[56] - 32

    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(postAddr).setData(data)
    )

    const msgUtf8 = data.subarray(52, 74).toString('utf8')
    console.log(c.dim('\nModified message:'), msgUtf8)

    console.log(
      '\nRefresh the Solana explorer and you should see the change:\n'
    )

    printSolanaExplorerAccountUrl(postAddr, { tab: 'anchor-account' })

    // Assertions (you can safely ignore these)
    {
      assert(
        acc.owner.equals(new web3.PublicKey(programAddr)),
        'owner is still solx program'
      )
      assert(msgUtf8.startsWith('HELLO'), 'data was modified to upper case')
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
