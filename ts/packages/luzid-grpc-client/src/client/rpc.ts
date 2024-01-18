import { createClient } from '../connection'
import type { Channel } from '../connection'

import {
  RpcGetAccountInfoRequest,
  RpcGetAccountInfoResponse,
  RpcGetAccountInfoServiceDefinition,
  RpcGetAccountInfoServiceClient,
  RpcRequestAirdropRequest,
  RpcRequestAirdropResponse,
  RpcRequestAirdropServiceDefinition,
  RpcRequestAirdropServiceClient,
} from '@luzid/grpc'

export {
  RpcContext,
  RpcGetAccountInfoRequest,
  RpcGetAccountInfoResponse,
  RpcRequestAirdropRequest,
  RpcRequestAirdropResponse,
} from '@luzid/grpc'

// -----------------
// RpcGetAccountInfoClient
// -----------------
class RpcGetAccountInfoClient {
  private readonly client: RpcGetAccountInfoServiceClient

  constructor(channel: Channel) {
    this.client = createClient(RpcGetAccountInfoServiceDefinition, channel)
  }

  getAccountInfo(
    request: RpcGetAccountInfoRequest
  ): Promise<RpcGetAccountInfoResponse> {
    return this.client.getAccountInfo(request)
  }
}

// -----------------
// RpcRequestAirdropClient
// -----------------
class RpcRequestAirdropClient {
  private readonly client: RpcRequestAirdropServiceClient

  constructor(channel: Channel) {
    this.client = createClient(RpcRequestAirdropServiceDefinition, channel)
  }

  requestAirdrop(
    request: RpcRequestAirdropRequest
  ): Promise<RpcRequestAirdropResponse> {
    return this.client.requestAirdrop(request)
  }
}

// -----------------
// Consolidated RpcClient
// -----------------
export class RpcClient {
  private readonly getAccountInfoClient: RpcGetAccountInfoClient
  private readonly requestAirdropClient: RpcRequestAirdropClient

  constructor(channel: Channel) {
    this.getAccountInfoClient = new RpcGetAccountInfoClient(channel)
    this.requestAirdropClient = new RpcRequestAirdropClient(channel)
  }

  getAccountInfo(
    request: RpcGetAccountInfoRequest
  ): Promise<RpcGetAccountInfoResponse> {
    return this.getAccountInfoClient.getAccountInfo(request)
  }

  requestAirdrop(
    request: RpcRequestAirdropRequest
  ): Promise<RpcRequestAirdropResponse> {
    return this.requestAirdropClient.requestAirdrop(request)
  }
}
