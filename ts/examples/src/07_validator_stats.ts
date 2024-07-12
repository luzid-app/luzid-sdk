import { LuzidSdk } from '@luzid/sdk'

async function main() {
  const luzid = new LuzidSdk()

  const info = await luzid.validator.getValidatorInfo()
  const status = await luzid.validator.getValidatorStatus()
  console.log({ info, status })

  const statsIter = luzid.validator.subValidatorStats()
  let lastSlot = 0n
  for await (const stats of statsIter) {
    if (stats.processedSlot > lastSlot + 20n) {
      lastSlot = stats.processedSlot
      console.log(stats)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
