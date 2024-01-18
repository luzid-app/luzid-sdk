import { createClient } from '../connection'
import type { Channel } from '../connection'
import {
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
  MutatorCloneAccountServiceDefinition,
  MutatorCloneAccountServiceClient,
} from '@luzid/grpc'

export {
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
} from '@luzid/grpc'

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
// Consolidated MutatorClient
// -----------------
export class MutatorClient {
  private readonly cloneAccountClient: MutatorCloneAccountClient

  constructor(channel: Channel) {
    this.cloneAccountClient = new MutatorCloneAccountClient(channel)
  }

  cloneAccount(
    request: MutatorCloneAccountRequest
  ): Promise<MutatorCloneAccountResponse> {
    return this.cloneAccountClient.cloneAccount(request)
  }
}
