import { createClient } from '@luzid/grpc-connection'
import type { Channel } from '@luzid/grpc-connection'

import {
  SnapshotGetAccountRequest,
  SnapshotGetAccountResponse,
  SnapshotGetAccountServiceDefinition,
  SnapshotGetAccountServiceClient,
  SnapshotGetSnaphotableAccountsRequest,
  SnapshotGetSnaphotableAccountsResponse,
  SnapshotManagementServiceDefinition,
  SnapshotManagementServiceClient,
  SnapshotListSnapshotsRequest,
  SnapshotListSnapshotsResponse,
  SnapshotRetrieveAccountsInSnapshotRequest,
  SnapshotRetrieveAccountsInSnapshotResponse,
  SnapshotRestoreAccountsFromSnapshotRequest,
  SnapshotRestoreAccountsFromSnapshotResponse,
  SnapshotRestoreServiceDefinition,
  SnapshotRestoreServiceClient,
  SnapshotCreateSnapshotRequest,
  SnapshotCreateSnapshotResponse,
  SnapshotDeleteSnapshotRequest,
  SnapshotDeleteSnapshotResponse,
} from '@luzid/grpc'

export {
  SnapshotGetAccountRequest,
  SnapshotGetAccountResponse,
  SnapshotGetSnaphotableAccountsRequest,
  SnapshotGetSnaphotableAccountsResponse,
  SnapshotMetadata,
  SnapshotCreateSnapshotRequest,
  SnapshotCreateSnapshotResponse,
  SnapshotSnapshotableAccount,
  SnapshotCreateSnapshotResult,
  SnapshotDeleteSnapshotRequest,
  SnapshotDeleteSnapshotResponse,
  SnapshotDeleteSnapshotResult,
  SnapshotListSnapshotsRequest,
  SnapshotListSnapshotsResponse,
  SnapshotRetrieveAccountsInSnapshotRequest,
  SnapshotRetrieveAccountsInSnapshotResponse,
  SnapshotRestoreAccountsFromSnapshotRequest,
  SnapshotRestoreAccountsFromSnapshotResponse,
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
    request: SnapshotGetSnaphotableAccountsRequest
  ): Promise<SnapshotGetSnaphotableAccountsResponse> {
    return this.client.getSnaphotableAccounts(request)
  }

  createSnapshot(
    request: SnapshotCreateSnapshotRequest
  ): Promise<SnapshotCreateSnapshotResponse> {
    return this.client.createSnapshot(request)
  }

  deleteSnapshot(
    request: SnapshotDeleteSnapshotRequest
  ): Promise<SnapshotDeleteSnapshotResponse> {
    return this.client.deleteSnapshot(request)
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
    request: SnapshotListSnapshotsRequest
  ): Promise<SnapshotListSnapshotsResponse> {
    return this.client.listSnapshots(request)
  }

  retrieveAccountsInSnapshot(
    request: SnapshotRetrieveAccountsInSnapshotRequest
  ): Promise<SnapshotRetrieveAccountsInSnapshotResponse> {
    return this.client.retrieveAccountsInSnapshot(request)
  }

  restoreAccountsFromSnapshot(
    request: SnapshotRestoreAccountsFromSnapshotRequest
  ): Promise<SnapshotRestoreAccountsFromSnapshotResponse> {
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
    request: SnapshotGetSnaphotableAccountsRequest
  ): Promise<SnapshotGetSnaphotableAccountsResponse> {
    return this.managementClient.getSnaphotableAccounts(request)
  }

  createSnapshot(
    request: SnapshotCreateSnapshotRequest
  ): Promise<SnapshotCreateSnapshotResponse> {
    return this.managementClient.createSnapshot(request)
  }

  deleteSnapshot(
    request: SnapshotDeleteSnapshotRequest
  ): Promise<SnapshotDeleteSnapshotResponse> {
    return this.managementClient.deleteSnapshot(request)
  }

  listSnapshots(
    request: SnapshotListSnapshotsRequest
  ): Promise<SnapshotListSnapshotsResponse> {
    return this.restoreClient.listSnapshots(request)
  }

  retrieveAccountsInSnapshot(
    request: SnapshotRetrieveAccountsInSnapshotRequest
  ): Promise<SnapshotRetrieveAccountsInSnapshotResponse> {
    return this.restoreClient.retrieveAccountsInSnapshot(request)
  }

  restoreAccountsFromSnapshot(
    request: SnapshotRestoreAccountsFromSnapshotRequest
  ): Promise<SnapshotRestoreAccountsFromSnapshotResponse> {
    return this.restoreClient.restoreAccountsFromSnapshot(request)
  }
}
