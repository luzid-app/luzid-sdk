import { LuzidGrpcClient } from '@luzid/grpc-client'

export class LuzidMeta {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Get the meta information of the Luzid backend.
   */
  getMeta() {
    return this.client.meta.getMeta()
  }
}
