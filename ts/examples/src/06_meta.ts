import { LuzidSdk } from '@luzid/sdk'

async function main() {
  const luzid = new LuzidSdk()
  const meta = await luzid.meta.getMeta()
  console.log(meta)
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
