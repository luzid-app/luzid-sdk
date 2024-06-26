import { AppOperation, AppOpsRequest, AppOpsResponse } from '@luzid/grpc'
import { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'

export class LuzidApp {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Controls the Luzid App, i.e to shut it down.
   *
   * @param op - The operation to perform {@link AppOperation.shutdown}
   */
  async appOps(op: AppOperation): Promise<Successful<AppOpsResponse>> {
    const req: AppOpsRequest = { op }
    const res = await this.client.app.appOps(req)
    return unwrap(res, 'Luzid app.appOps')
  }
}
