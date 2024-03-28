import { LuzidSdk } from '@luzid/sdk'

const WORKSPACE = process.env.WORKSPACE

if (WORKSPACE == null) {
  console.error(`WORKSPACE env var is required for example:

export WORKSPACE=/path/to/workspace
yarn workspace:watch
`)
  process.exit(1)
}

async function main() {
  const luzid = new LuzidSdk()
  const sigs = await luzid.workspace.watchWorkspace(WORKSPACE)
  console.log({ sigs })
  console.log(await luzid.workspace.listWorkspaces())
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
