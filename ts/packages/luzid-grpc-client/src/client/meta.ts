import { createClient } from '@luzid/grpc-connection'
import type { Channel } from '@luzid/grpc-connection'
import {
  MetaRequest,
  MetaResponse,
  MetaServiceDefinition,
  MetaServiceClient,
} from '@luzid/grpc'

export { MetaRequest, MetaResponse, Meta } from '@luzid/grpc'

export class MetaClient {
  private readonly client: MetaServiceClient

  constructor(channel: Channel) {
    this.client = createClient(MetaServiceDefinition, channel)
  }

  getMeta(request: MetaRequest): Promise<MetaResponse> {
    return this.client.getMeta(request)
  }
}
