// Default connection which is overridden to ./web.ts via the browser field in package.json
import { Channel, createChannel as nodeCreateChannel } from 'nice-grpc'

export { createClient } from 'nice-grpc'
export type { Channel, Client } from 'nice-grpc'

export function createChannel(url: string): Channel {
  return nodeCreateChannel(url)
}

export function createLocalChannel(port: number): Channel {
  return createChannel(`http://localhost:${port}`)
}
