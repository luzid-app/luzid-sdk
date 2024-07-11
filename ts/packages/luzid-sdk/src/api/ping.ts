import { PingResponse } from '@luzid/grpc'

import { LuzidGrpcClient } from '@luzid/grpc-client'

export { PingResponse }

export class LuzidPing {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Pings the Luzid backend.
   */
  async ping(): Promise<PingResponse> {
    return this.client.ping.ping()
  }
}
