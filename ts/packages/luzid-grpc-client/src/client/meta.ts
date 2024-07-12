import { createClient } from '@luzid/grpc-connection'
import type { Channel } from '@luzid/grpc-connection'
import {
  MetaResponse,
  MetaServiceDefinition,
  MetaServiceClient,
} from '@luzid/grpc'

export { MetaResponse, Meta } from '@luzid/grpc'

export class MetaClient {
  private readonly client: MetaServiceClient

  constructor(channel: Channel) {
    this.client = createClient(MetaServiceDefinition, channel)
  }

  /**
   * Get the meta information of the Luzid backend.
   */
  getMeta(): Promise<MetaResponse> {
    return this.client.getMeta({})
  }
}
