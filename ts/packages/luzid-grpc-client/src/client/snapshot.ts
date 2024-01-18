import { createClient } from '../connection'
import type { Channel } from '../connection'

import {
  SnapshotGetAccountRequest,
  SnapshotGetAccountResponse,
  SnapshotGetAccountServiceDefinition,
  SnapshotGetAccountServiceClient,
  SnapshotManagementGetSnaphotableAccountsRequest,
  SnapshotManagementGetSnaphotableAccountsResponse,
  SnapshotManagementServiceDefinition,
  SnapshotManagementServiceClient,
  SnapshotRestoreListSnapshotsRequest,
  SnapshotRestoreListSnapshotsResponse,
  SnapshotRestoreRetrieveAccountsInSnapshotRequest,
  SnapshotRestoreRetrieveAccountsInSnapshotResponse,
  SnapshotRestoreRestoreAccountsFromSnapshotRequest,
  SnapshotRestoreRestoreAccountsFromSnapshotResponse,
  SnapshotRestoreServiceDefinition,
  SnapshotRestoreServiceClient,
} from '@luzid/grpc'

export {
  SnapshotGetAccountRequest,
  SnapshotGetAccountResponse,
  SnapshotManagementGetSnaphotableAccountsRequest,
  SnapshotManagementGetSnaphotableAccountsResponse,
  RpcSnapshotMetadata,
  SnapshotRestoreListSnapshotsRequest,
  SnapshotRestoreListSnapshotsResponse,
  SnapshotRestoreRetrieveAccountsInSnapshotRequest,
  SnapshotRestoreRetrieveAccountsInSnapshotResponse,
  SnapshotRestoreRestoreAccountsFromSnapshotRequest,
  SnapshotRestoreRestoreAccountsFromSnapshotResponse,
} from '@luzid/grpc'

// -----------------
// SnapshotGetAccountClient
// -----------------
class SnapshotGetAccountClient {
  private readonly client: SnapshotGetAccountServiceClient

  constructor(channel: Channel) {
    this.client = createClient(SnapshotGetAccountServiceDefinition, channel)
  }

  getAccount(
    request: SnapshotGetAccountRequest
  ): Promise<SnapshotGetAccountResponse> {
    return this.client.getAccount(request)
  }
}

// -----------------
// SnapshotManagementClient
// -----------------
class SnapshotManagementClient {
  private readonly client: SnapshotManagementServiceClient

  constructor(channel: Channel) {
    this.client = createClient(SnapshotManagementServiceDefinition, channel)
  }

  getSnaphotableAccounts(
    request: SnapshotManagementGetSnaphotableAccountsRequest
  ): Promise<SnapshotManagementGetSnaphotableAccountsResponse> {
    return this.client.getSnaphotableAccounts(request)
  }
}

// -----------------
// SnapshotRestoreClient
// -----------------
class SnapshotRestoreClient {
  private readonly client: SnapshotRestoreServiceClient

  constructor(channel: Channel) {
    this.client = createClient(SnapshotRestoreServiceDefinition, channel)
  }

  listSnapshots(
    request: SnapshotRestoreListSnapshotsRequest
  ): Promise<SnapshotRestoreListSnapshotsResponse> {
    return this.client.listSnapshots(request)
  }

  retrieveAccountsInSnapshot(
    request: SnapshotRestoreRetrieveAccountsInSnapshotRequest
  ): Promise<SnapshotRestoreRetrieveAccountsInSnapshotResponse> {
    return this.client.retrieveAccountsInSnapshot(request)
  }

  restoreAccountsFromSnapshot(
    request: SnapshotRestoreRestoreAccountsFromSnapshotRequest
  ): Promise<SnapshotRestoreRestoreAccountsFromSnapshotResponse> {
    return this.client.restoreAccountsFromSnapshot(request)
  }
}

// -----------------
// Consolidated SnapshotClient
// -----------------
export class SnapshotClient {
  private readonly getAccountClient: SnapshotGetAccountClient
  private readonly managementClient: SnapshotManagementClient
  private readonly restoreClient: SnapshotRestoreClient

  constructor(channel: Channel) {
    this.getAccountClient = new SnapshotGetAccountClient(channel)
    this.managementClient = new SnapshotManagementClient(channel)
    this.restoreClient = new SnapshotRestoreClient(channel)
  }

  getAccount(
    request: SnapshotGetAccountRequest
  ): Promise<SnapshotGetAccountResponse> {
    return this.getAccountClient.getAccount(request)
  }

  getSnaphotableAccounts(
    request: SnapshotManagementGetSnaphotableAccountsRequest
  ): Promise<SnapshotManagementGetSnaphotableAccountsResponse> {
    return this.managementClient.getSnaphotableAccounts(request)
  }

  listSnapshots(
    request: SnapshotRestoreListSnapshotsRequest
  ): Promise<SnapshotRestoreListSnapshotsResponse> {
    return this.restoreClient.listSnapshots(request)
  }

  retrieveAccountsInSnapshot(
    request: SnapshotRestoreRetrieveAccountsInSnapshotRequest
  ): Promise<SnapshotRestoreRetrieveAccountsInSnapshotResponse> {
    return this.restoreClient.retrieveAccountsInSnapshot(request)
  }

  restoreAccountsFromSnapshot(
    request: SnapshotRestoreRestoreAccountsFromSnapshotRequest
  ): Promise<SnapshotRestoreRestoreAccountsFromSnapshotResponse> {
    return this.restoreClient.restoreAccountsFromSnapshot(request)
  }
}
