import { createClient } from '../connection'
import type { Channel } from '../connection'
import {
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
  MutatorCloneAccountServiceDefinition,
  MutatorCloneAccountServiceClient,
  MutatorModifyAccountServiceClient,
  MutatorModifyAccountServiceDefinition,
  MutatorModifyAccountRequest,
  MutatorModifyAccountResponse,
} from '@luzid/grpc'

export {
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
} from '@luzid/grpc'

// -----------------
// MutatorCloneAccountClient
// -----------------
class MutatorCloneAccountClient {
  private readonly client: MutatorCloneAccountServiceClient

  constructor(channel: Channel) {
    this.client = createClient(MutatorCloneAccountServiceDefinition, channel)
  }

  cloneAccount(
    request: MutatorCloneAccountRequest
  ): Promise<MutatorCloneAccountResponse> {
    return this.client.cloneAccount(request)
  }
}

// -----------------
// MutatorModifyAccountClient
// -----------------
class MutatorModifyAccountClient {
  private readonly client: MutatorModifyAccountServiceClient

  constructor(channel: Channel) {
    this.client = createClient(MutatorModifyAccountServiceDefinition, channel)
  }

  modifyAccount(
    request: MutatorModifyAccountRequest
  ): Promise<MutatorModifyAccountResponse> {
    return this.client.modifyAccount(request)
  }
}

// -----------------
// Consolidated MutatorClient
// -----------------
export class MutatorClient {
  private readonly cloneAccountClient: MutatorCloneAccountClient
  private readonly modifyAccountClient: MutatorModifyAccountClient

  constructor(channel: Channel) {
    this.cloneAccountClient = new MutatorCloneAccountClient(channel)
    this.modifyAccountClient = new MutatorModifyAccountClient(channel)
  }

  cloneAccount(
    request: MutatorCloneAccountRequest
  ): Promise<MutatorCloneAccountResponse> {
    return this.cloneAccountClient.cloneAccount(request)
  }

  modifyAccount(
    request: MutatorModifyAccountRequest
  ): Promise<MutatorModifyAccountResponse> {
    return this.modifyAccountClient.modifyAccount(request)
  }
}
