import { Cluster, LuzidSdk } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import * as c from 'ansi-colors'
import { assert, printAccountInfo, readKey } from './helpers'

// The program account we will clone and snapshot
const accAddr = '5ZspQX4nw95meJHpXBF425NytnNTDgtLBBGVDK9EWmRy'

async function main() {
  let lamportsBeforeAirdrop: number
  let lamportsAfterAirdrop: number

  const luzid = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  // 1. Clone a Devnet account
  {
    console.log(
      c.bold('\n1. Cloning an account of the SolX program from devnet...')
    )

    await luzid.mutator.cloneAccount(Cluster.Devnet, accAddr, {
      commitment: 'confirmed',
    })
    const acc = await conn.getAccountInfo(new web3.PublicKey(accAddr))
    printAccountInfo(acc)

    lamportsBeforeAirdrop = acc.lamports

    console.log(
      c.italic.dim(
        "\nThe account '5ZspQ...' was cloned and is now snapshotable. Notice how many lamports it has."
      )
    )
  }

  // 2. Get snapshotable accounts
  {
    console.log(c.bold('\n2. Getting snapshotable accounts...'))
    const accounts = await luzid.snapshot.getSnaphotableAccounts({
      commitment: 'confirmed',
    })

    console.log('\nSnapshotable accounts:', accounts)

    assert(accounts.map((a) => a.pubkey).includes(accAddr))

    await readKey()
  }

  // 3. Snapshot the account
  let snapshotId: string
  {
    console.log(c.bold('\n3. Snapshotting the account...'))
    const res = await luzid.snapshot.createSnapshot(
      'Luzid Snapshot Example',
      [accAddr],
      {
        group: 'example:snapshot',
        description: 'Snapshotting the account we just cloned',
        commitment: 'confirmed',
      }
    )
    console.log('\nCreated snapshot', res)
    snapshotId = res.snapshotId
  }

  // 4. List snapshots
  {
    console.log(c.bold('\n4. Listing snapshots...'))
    const snapshots = await luzid.snapshot.listSnapshots()
    console.log('\nSnapshots:', snapshots)

    assert(snapshots.map((s) => s.snapshotId).includes(snapshotId))

    await readKey()
  }

  // 5. Airdrop to the account
  {
    console.log(c.bold('\n5. Airdropping 1 SOL to the account...\n'))

    // Airdrop
    const signature = await conn.requestAirdrop(
      new web3.PublicKey(accAddr),
      web3.LAMPORTS_PER_SOL
    )

    console.log('* Airdrop signature: %s', c.dim(signature))
    process.stdout.write('* Confirming transaction...')
    await conn.confirmTransaction({
      signature,
      ...(await conn.getLatestBlockhash()),
    })
    process.stdout.write(' \u2713\n\n')

    // Inspect account
    const acc = await conn.getAccountInfo(new web3.PublicKey(accAddr))
    printAccountInfo(acc)

    console.log(
      c.italic.dim(
        "\nThe account '5ZspQ...' was airdropped to. Notice how many lamports it has now."
      )
    )

    lamportsAfterAirdrop = acc.lamports
    assert(lamportsAfterAirdrop > lamportsBeforeAirdrop)

    await readKey()
  }

  // 6. Restore snapshot
  {
    console.log(c.bold('\n6. Restoring snapshot...\n'))

    // Restore
    const res = await luzid.snapshot.restoreAccountsFromSnapshot(snapshotId, {
      accounts: [accAddr],
      commitment: 'confirmed',
    })
    console.log('Restored Snapshot:', res)

    // Inspect account
    const acc = await conn.getAccountInfo(new web3.PublicKey(accAddr))
    printAccountInfo(acc)

    assert(acc.lamports === lamportsBeforeAirdrop)

    console.log(
      c.italic.dim(
        "\nThe account '5ZspQ...' was restored from the snapshot. Lamports are back to before the airdrop."
      )
    )

    await readKey()
  }

  // 7. Delete snapshot
  {
    console.log(c.bold('\n7. Deleting snapshot...'))
    const res = await luzid.snapshot.deleteSnapshot(snapshotId)
    console.log('Snapshot deleted:', res)
  }
  // 8. List snapshots again
  {
    console.log(c.bold('\n8. Listing snapshots again...'))
    const snapshots = await luzid.snapshot.listSnapshots()
    console.log('Snapshots:', snapshots)

    assert(!snapshots.map((s) => s.snapshotId).includes(snapshotId))
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
