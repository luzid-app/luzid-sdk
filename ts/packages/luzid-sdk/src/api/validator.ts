import {
  ValidatorOpsOperation,
  ValidatorOpsRequest,
  ValidatorOpsResponse,
} from '@luzid/grpc'

import type { LuzidGrpcClient } from '@luzid/grpc-client'

export class LuzidValidator {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Performs an operation on the validator.
   *
   * @param **op**: The operation to perform (start|stop|restart)
   */
  async validatorOps(
    op: ValidatorOpsOperation
  ): Promise<Omit<ValidatorOpsResponse, 'error'>> {
    const req: ValidatorOpsRequest = { op }
    const res = await this.client.validator.validatorOps(req)
    if (res.error != null) {
      throw new Error(
        `Luzid validator.validatorOps returned an error:\n${res.error}`
      )
    } else {
      return res
    }
  }
}
