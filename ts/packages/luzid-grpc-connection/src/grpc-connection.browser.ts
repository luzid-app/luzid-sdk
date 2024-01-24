import {
  Channel,
  FetchTransport,
  createChannel as webCreateChannel,
} from 'nice-grpc-web'
export { createClient } from 'nice-grpc-web'
export type { Channel, Client } from 'nice-grpc-web'

export function createChannel(url: string): Channel {
  return webCreateChannel(url, FetchTransport())
}

export function createLocalChannel(port: number): Channel {
  return createChannel(`http://localhost:${port}`)
}
