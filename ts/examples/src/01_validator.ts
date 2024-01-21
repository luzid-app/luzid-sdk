import { Cluster, LuzidSdk } from '@luzid/sdk'
import { sleep } from './helpers'
import * as web3 from '@solana/web3.js'

async function main() {
  const luzid = new LuzidSdk()
  const conn = new web3.Connection(Cluster.Development.apiUrl, 'confirmed')

  // 1. Stop the validator (it is starts automatically when you launch Luzid)
  {
    console.log('\nStopping validator...')
    await luzid.validator.stop()
    try {
      // This now throws an error because the validator is stopped
      await conn.getVersion()
    } catch (err) {
      console.log('* Validator was stopped as expected (%s)', err.message)
      console.log('* Have a look at the toggle in the UI to see it is down')
    }
  }

  // 2. Start the validator
  {
    console.log('\nStarting validator...')
    await luzid.validator.start()

    const version = await conn.getVersion()
    console.log(
      `* Validator v${version['solana-core']} was started as expected`
    )
    console.log('* Have a look at the toggle in the UI to see it is up again')

    // Giving a chance to see it up in UI before we restart it
    await sleep(5000)
  }

  // 3. Restart the validator
  {
    console.log('\nRestarting validator...')
    await luzid.validator.restart()

    const version = await conn.getVersion()
    console.log(
      `* Validator v${version['solana-core']} was restarted as expected`
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
