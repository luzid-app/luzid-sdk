import { Cluster, LuzidSdk } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import * as c from 'ansi-colors'

const pubkey = web3.Keypair.generate().publicKey
async function main() {
  const luzid = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  console.log(c.bold('Airdropping 1 SOL to an account...\n'))

  const signature = await conn.requestAirdrop(
    pubkey,
    web3.LAMPORTS_PER_SOL
  )

  const label = '🪂 airdrop'
  console.log(`* Labeling signature: ${c.dim(signature)} "${label}"`)
  await luzid.transaction.labelTransaction(signature, label)
  console.log('* Luzid will now show it under that label')
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
