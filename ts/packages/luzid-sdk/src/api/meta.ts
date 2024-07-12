import { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'
import { MetaResponse } from '@luzid/grpc'

export { MetaResponse } from '@luzid/grpc'

export class LuzidMeta {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Get the meta information of the Luzid backend.
   */
  async getMeta(): Promise<Successful<MetaResponse>> {
    const res = await this.client.meta.getMeta()
    return unwrap(res, 'Luzid meta.getMeta')
  }
}
