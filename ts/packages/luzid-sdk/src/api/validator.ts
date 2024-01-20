import {
  ValidatorOpsOperation,
  ValidatorOpsRequest,
  ValidatorOpsResponse,
} from '@luzid/grpc'

import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, maybeThrow } from '../core/utils'

export class LuzidValidator {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Performs an operation on the validator.
   *
   * @param **op**: The operation to perform (start|stop|restart)
   */
  async validatorOps(
    op: ValidatorOpsOperation
  ): Promise<Successful<ValidatorOpsResponse>> {
    const req: ValidatorOpsRequest = { op }
    const res = await this.client.validator.validatorOps(req)
    return maybeThrow(res, 'Luzid validator.validatorOps')
  }
}
