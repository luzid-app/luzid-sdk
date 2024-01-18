import { createClient } from '../connection'
import type { Channel } from '../connection'

import {
  StoreGetAccountDataRequest,
  StoreGetAccountDataResponse,
  StoreGetAccountDataServiceDefinition,
  StoreGetAccountDataServiceClient,
  StoreGetDiffedAccountUpdateRequest,
  StoreGetDiffedAccountUpdateResponse,
  StoreGetDiffedAccountUpdateServiceDefinition,
  StoreGetDiffedAccountUpdateServiceClient,
} from '@luzid/grpc'

export {
  RpcAccountData,
  StoreGetAccountDataRequest,
  StoreGetAccountDataResponse,
  StoreGetDiffedAccountUpdateRequest,
  StoreGetDiffedAccountUpdateResponse,
} from '@luzid/grpc'

// -----------------
// StoreGetAccountDataClient
// -----------------
class StoreGetAccountDataClient {
  private readonly client: StoreGetAccountDataServiceClient

  constructor(channel: Channel) {
    this.client = createClient(StoreGetAccountDataServiceDefinition, channel)
  }

  getAccountData(
    request: StoreGetAccountDataRequest
  ): Promise<StoreGetAccountDataResponse> {
    return this.client.getAccountData(request)
  }
}

// -----------------
// StoreGetDiffedAccountUpdateClient
// -----------------
class StoreGetDiffedAccountUpdateClient {
  private readonly client: StoreGetDiffedAccountUpdateServiceClient

  constructor(channel: Channel) {
    this.client = createClient(
      StoreGetDiffedAccountUpdateServiceDefinition,
      channel
    )
  }

  getDiffedAccountUpdate(
    request: StoreGetDiffedAccountUpdateRequest
  ): Promise<StoreGetDiffedAccountUpdateResponse> {
    return this.client.getDiffedAccountUpdate(request)
  }
}

// -----------------
// Consolidated StoreClient
// -----------------
export class StoreClient {
  private readonly getAccountDataClient: StoreGetAccountDataClient
  private readonly getDiffedAccountUpdateClient: StoreGetDiffedAccountUpdateClient

  constructor(channel: Channel) {
    this.getAccountDataClient = new StoreGetAccountDataClient(channel)
    this.getDiffedAccountUpdateClient = new StoreGetDiffedAccountUpdateClient(
      channel
    )
  }

  getAccountData(
    request: StoreGetAccountDataRequest
  ): Promise<StoreGetAccountDataResponse> {
    return this.getAccountDataClient.getAccountData(request)
  }

  getDiffedAccountUpdate(
    request: StoreGetDiffedAccountUpdateRequest
  ): Promise<StoreGetDiffedAccountUpdateResponse> {
    return this.getDiffedAccountUpdateClient.getDiffedAccountUpdate(request)
  }
}
