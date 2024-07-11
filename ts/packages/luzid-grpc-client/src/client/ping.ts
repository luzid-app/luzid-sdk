import type { Channel } from '@luzid/grpc-connection'
import { createClient } from '@luzid/grpc-connection'
import {
  PingResponse,
  PingServiceClient,
  PingServiceDefinition,
} from '@luzid/grpc'

export { PingRequest, PingResponse } from '@luzid/grpc'

export class PingClient {
  private readonly client: PingServiceClient

  constructor(channel: Channel) {
    this.client = createClient(PingServiceDefinition, channel)
  }

  async ping(): Promise<PingResponse> {
    return this.client.ping({})
  }
}
