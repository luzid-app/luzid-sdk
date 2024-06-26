import { createClient } from '@luzid/grpc-connection'
import type { Channel } from '@luzid/grpc-connection'

import {
  ValidatorOpsRequest,
  ValidatorOpsResponse,
  ValidatorOpsServiceClient,
  ValidatorOpsServiceDefinition,
} from '@luzid/grpc'

export {
  ValidatorOpsRequest,
  ValidatorOpsResponse,
  ValidatorOperation,
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

// -----------------
// Consolidated ValidatorClient
// -----------------
export class ValidatorClient {
  private readonly validatorOpsClient: ValidatorOpsClient

  constructor(channel: Channel) {
    this.validatorOpsClient = new ValidatorOpsClient(channel)
  }

  validatorOps(request: ValidatorOpsRequest): Promise<ValidatorOpsResponse> {
    return this.validatorOpsClient.validatorOps(request)
  }
}
