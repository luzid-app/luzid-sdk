import {
  ValidatorOperation,
  ValidatorOpsRequest,
  ValidatorOpsResponse,
} from '@luzid/grpc'

import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'

export class LuzidValidator {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Performs an operation on the validator.
   *
   * @param op - The operation to perform (start|stop|restart)
   *
   * @private
   */
  private async validatorOps(
    op: ValidatorOperation
  ): Promise<Successful<ValidatorOpsResponse>> {
    const req: ValidatorOpsRequest = { op }
    const res = await this.client.validator.validatorOps(req)
    return unwrap(res, 'Luzid validator.validatorOps')
  }

  /**
   * Starts the validator.
   */
  start(): Promise<Successful<ValidatorOpsResponse>> {
    return this.validatorOps(ValidatorOperation.Start)
  }

  /**
   * Stops the validator.
   */
  stop(): Promise<Successful<ValidatorOpsResponse>> {
    return this.validatorOps(ValidatorOperation.Stop)
  }

  /**
   * Restarts the validator.
   */
  restart(): Promise<Successful<ValidatorOpsResponse>> {
    return this.validatorOps(ValidatorOperation.Restart)
  }
}
