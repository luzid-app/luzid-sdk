import { createClient } from '@luzid/grpc-connection'
import type { Channel } from '@luzid/grpc-connection'

import {
  ValidatorInfo,
  ValidatorInfoSubClient,
  ValidatorInfoSubDefinition,
  ValidatorOpsRequest,
  ValidatorOpsResponse,
  ValidatorOpsServiceClient,
  ValidatorOpsServiceDefinition,
  ValidatorStats,
  ValidatorStatsSubClient,
  ValidatorStatsSubDefinition,
  ValidatorStatus,
  ValidatorStatusSubClient,
  ValidatorStatusSubDefinition,
} from '@luzid/grpc'

export {
  ValidatorInfo,
  ValidatorOperation,
  ValidatorOpsRequest,
  ValidatorOpsResponse,
  ValidatorStats,
  ValidatorStatus,
  validatorOperationFromJSON,
  validatorOperationToJSON,
} from '@luzid/grpc'

class ValidatorOpsClient {
  private readonly client: ValidatorOpsServiceClient

  constructor(channel: Channel) {
    this.client = createClient(ValidatorOpsServiceDefinition, channel)
  }

  validatorOps(request: ValidatorOpsRequest): Promise<ValidatorOpsResponse> {
    return this.client.validatorOps(request)
  }
}

class _ValidatorInfoSubClient {
  private readonly client: ValidatorInfoSubClient

  constructor(channel: Channel) {
    this.client = createClient(ValidatorInfoSubDefinition, channel)
  }

  subValidatorInfo(opts: {
    emitCurrent: boolean
  }): AsyncIterable<ValidatorInfo> {
    return this.client.subValidatorInfo(opts)
  }
}

class _ValidatorStatusSubClient {
  private readonly client: ValidatorStatusSubClient

  constructor(channel: Channel) {
    this.client = createClient(ValidatorStatusSubDefinition, channel)
  }

  subValidatorStatus(opts: {
    emitCurrent: boolean
  }): AsyncIterable<ValidatorStatus> {
    return this.client.subValidatorStatus(opts)
  }
}

class _ValidatorStatsSubClient {
  private readonly client: ValidatorStatsSubClient

  constructor(channel: Channel) {
    this.client = createClient(ValidatorStatsSubDefinition, channel)
  }

  subValidatorStats(opts: {
    emitCurrent: boolean
  }): AsyncIterable<ValidatorStats> {
    return this.client.subValidatorStats(opts)
  }
}

// -----------------
// Consolidated ValidatorClient
// -----------------
export class ValidatorClient {
  private readonly validatorOpsClient: ValidatorOpsClient
  private readonly validatorInfoSubClient: _ValidatorInfoSubClient
  private readonly validatorStatusSubClient: _ValidatorStatusSubClient
  private readonly validatorStatsSubClient: _ValidatorStatsSubClient

  constructor(channel: Channel) {
    this.validatorOpsClient = new ValidatorOpsClient(channel)
    this.validatorInfoSubClient = new _ValidatorInfoSubClient(channel)
    this.validatorStatusSubClient = new _ValidatorStatusSubClient(channel)
    this.validatorStatsSubClient = new _ValidatorStatsSubClient(channel)
  }

  validatorOps(request: ValidatorOpsRequest): Promise<ValidatorOpsResponse> {
    return this.validatorOpsClient.validatorOps(request)
  }

  subValidatorInfo(opts: {
    emitCurrent: boolean
  }): AsyncIterable<ValidatorInfo> {
    return this.validatorInfoSubClient.subValidatorInfo(opts)
  }

  subValidatorStatus(opts: {
    emitCurrent: boolean
  }): AsyncIterable<ValidatorStatus> {
    return this.validatorStatusSubClient.subValidatorStatus(opts)
  }

  subValidatorStats(opts: {
    emitCurrent: boolean
  }): AsyncIterable<ValidatorStats> {
    return this.validatorStatsSubClient.subValidatorStats(opts)
  }
}
