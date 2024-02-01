import { Cluster } from '@luzid/sdk'
import * as web3 from '@solana/web3.js'
import { printSolanaExplorerTransactionUrl } from '../helpers'

const FALSE = process.env.HOOCHIEMAMA != null

const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')
async function main() {
  const luzidMasterPair = web3.Keypair.generate()
  const accountBeingModifiedPair = web3.Keypair.generate()
  const newOwnerPair = web3.Keypair.generate()
  console.log({
    keypair: accountBeingModifiedPair.publicKey.toBase58(),
    newOwner: newOwnerPair.publicKey.toBase58(),
  })
  {
    await funcAccountAndLogTx(luzidMasterPair.publicKey, 'luzidMasterPair')
    await funcAccountAndLogTx(
      accountBeingModifiedPair.publicKey,
      'acconutBeingModifiedPair'
    )
    await funcAccountAndLogTx(newOwnerPair.publicKey, 'newOwnerPair')
  }

  {
    const ix = luzidProgramInstruction(
      luzidMasterPair,
      accountBeingModifiedPair,
      newOwnerPair.publicKey
    )
    console.log(ix)
    const tx = new web3.Transaction().add(ix)

    const sig = await web3.sendAndConfirmTransaction(
      conn,
      tx,
      [luzidMasterPair],
      {
        commitment: 'confirmed',
        skipPreflight: true,
      }
    )
    printSolanaExplorerTransactionUrl(sig)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })

const LUZID_PROGRAM_ADDR = 'Luzid11111111111111111111111111111111111111'
const LUZID_PROGRAM_ID = new web3.PublicKey(LUZID_PROGRAM_ADDR)

function luzidProgramInstruction(
  luzidMasterPair: web3.Keypair,
  accountPair: web3.Keypair,
  newOwner: web3.PublicKey
): web3.TransactionInstruction {
  // prettier-ignore
  const dataArray = [
/* 0000 */  0x00, 0x00, 0x00, 0x00,
/* 0004 */  0x00, 0xca, 0x9a, 0x3b,
/* 0008 */  0x00, 0x00, 0x00, 0x00,
/* 0012 */  0x00, 0x00, 0x00, 0x00,
/* 0016 */  0x00, 0x00, 0x00, 0x00,
/* 0020 */  0x00, 0x00, 0x00, 0x00,
/* 0024 */  0x00, 0x00, 0x00, 0x00,
/* 0028 */  0x00, 0x00, 0x00, 0x00,
/* 0032 */  0x00, 0x00, 0x00, 0x00,
/* 0036 */  0x00, 0x00, 0x00, 0x00,
/* 0040 */  0x00, 0x00, 0x00, 0x00,
/* 0044 */  0x00, 0x00, 0x00, 0x00,
/* 0048 */  0x00, 0x00, 0x00, 0x00,
  ]
  // const data = Buffer.from(dataArray)
  const data = Buffer.from([0x00, 0x00, 0x00, 0x00])

  return new web3.TransactionInstruction({
    keys: [
      { pubkey: luzidMasterPair.publicKey, isSigner: true, isWritable: false },
      { pubkey: accountPair.publicKey, isSigner: false, isWritable: true },
      { pubkey: newOwner, isSigner: false, isWritable: true },
    ],
    programId: LUZID_PROGRAM_ID,
    data,
  })
}

// -----------------
// web3 Helpers
// -----------------
async function funcAccountAndLogTx(pubkey: web3.PublicKey, label: string) {
  const sig = await fundAccount(pubkey)
  console.log(`\n${label}`)
  printSolanaExplorerTransactionUrl(sig)
}

async function fundAccount(pubkey: web3.PublicKey) {
  const signature = await conn.requestAirdrop(pubkey, web3.LAMPORTS_PER_SOL * 5)
  await conn.confirmTransaction({
    signature,
    ...(await conn.getLatestBlockhash()),
  })
  return signature
}

async function createAccountWithSystemProgram(
  fromPair: web3.Keypair,
  newPair: web3.Keypair
) {
  const ix = web3.SystemProgram.createAccount({
    fromPubkey: fromPair.publicKey,
    newAccountPubkey: newPair.publicKey,
    lamports: web3.LAMPORTS_PER_SOL,
    space: 0,
    programId: web3.SystemProgram.programId,
  })
  const tx = new web3.Transaction().add(ix)
  const sig = await web3.sendAndConfirmTransaction(
    conn,
    tx,
    [fromPair, newPair],
    {
      commitment: 'confirmed',
      skipPreflight: true,
    }
  )
  printSolanaExplorerTransactionUrl(sig)
}
