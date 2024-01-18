import { AppOpsOperation, AppOpsRequest, AppOpsResponse } from '@luzid/grpc'
import { LuzidGrpcClient } from '@luzid/grpc-client'

export class LuzidApp {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Controls the Luzid App, i.e to shut it down.
   *
   * @param **op**: The operation to perform {@link AppOpsOperation.shutdown}
   */
  async appOps(op: AppOpsOperation): Promise<Omit<AppOpsResponse, 'error'>> {
    const req: AppOpsRequest = { op }
    const res = await this.client.app.appOps(req)
    if (res.error != null) {
      throw new Error(`Luzid app.appOps returned an error:\n${res.error}`)
    } else {
      return res
    }
  }
}
