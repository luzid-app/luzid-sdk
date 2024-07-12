import {
  ValidatorInfo,
  ValidatorOperation,
  ValidatorOpsRequest,
  ValidatorOpsResponse,
  ValidatorStats,
} from '@luzid/grpc'

import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'
import { ValidatorStatus } from '@luzid/grpc'

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

  /*
   * Subscribes to validator info updates.
   * This usually is emitted once per validator start.
   *
   * @param opts
   * @param opts.emitCurrent - Whether to emit the current value.
   */
  subValidatorInfo({ emitCurrent = false } = {}): AsyncIterable<ValidatorInfo> {
    return this.client.validator.subValidatorInfo({ emitCurrent })
  }

  /**
   * Retrieves the current validator info or the earliest available.
   *
   * @param opts
   * @param opts.emitCurrent - Whether to emit the current value.
   */
  async getValidatorInfo({ emitCurrent = true } = {}): Promise<ValidatorInfo> {
    const iter = this.client.validator.subValidatorInfo({ emitCurrent })
    for await (const info of iter) {
      return info
    }
    throw new Error('Missing ValidatorInfo')
  }

  /**
   * Subscribes to validator status updates.
   * This usually is emitted once per validator start or stop.
   *
   * @param opts
   * @param opts.emitCurrent - Whether to emit the current value.
   */
  subValidatorStatus({
    emitCurrent = false,
  } = {}): AsyncIterable<ValidatorStatus> {
    return this.client.validator.subValidatorStatus({ emitCurrent })
  }

  /**
   * Retrieves the current validator status or the earliest available.
   * This is emitted once per validator start or stop.
   *
   * @param opts
   * @param opts.emitCurrent - Whether to emit the current value.
   */
  async getValidatorStatus({
    emitCurrent = true,
  } = {}): Promise<ValidatorStatus> {
    const iter = this.client.validator.subValidatorStatus({ emitCurrent })
    for await (const status of iter) {
      return status
    }
    throw new Error('Missing ValidatorStatus')
  }

  /**
   * Subscribes to validator stats updates.
   * This is emitted per slot.
   *
   * @param opts
   * @param opts.emitCurrent - Whether to emit the current value.
   */
  subValidatorStats({
    emitCurrent = false,
  } = {}): AsyncIterable<ValidatorStats> {
    return this.client.validator.subValidatorStats({ emitCurrent })
  }

  /**
   * Retrieves the current validator stats or the earliest available.
   * This is emitted per slot.
   *
   * @param opts
   * @param opts.emitCurrent - Whether to emit the current value.
   */
  async getValidatorStats({
    emitCurrent = true,
  } = {}): Promise<ValidatorStats> {
    const iter = this.client.validator.subValidatorStats({ emitCurrent })
    for await (const stats of iter) {
      return stats
    }
    throw new Error('Missing ValidatorStats')
  }
}
