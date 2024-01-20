import {
  SnapshotManagementGetSnaphotableAccountsRequest,
  SnapshotManagementGetSnaphotableAccountsResponse,
  SnapshotRestoreListSnapshotsRequest,
  SnapshotRestoreListSnapshotsResponse,
  SnapshotRestoreRestoreAccountsFromSnapshotRequest,
  SnapshotRestoreRestoreAccountsFromSnapshotResponse,
  SnapshotRestoreRetrieveAccountsInSnapshotRequest,
  SnapshotRestoreRetrieveAccountsInSnapshotResponse,
} from '@luzid/grpc'
import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, maybeThrow } from '../core/utils'

export class LuzidSnapshot {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Returns the pubkeys of accounts that can be snapshotted.
   *
   * @param **includeProgramAccounts**: whether to include program accounts
   */
  async getSnaphotableAccounts(
    includeProgramAccounts: boolean = false
  ): Promise<Successful<SnapshotManagementGetSnaphotableAccountsResponse>> {
    const req: SnapshotManagementGetSnaphotableAccountsRequest = {
      includeProgramAccounts,
    }
    const res = await this.client.snapshot.getSnaphotableAccounts(req)
    return maybeThrow(res, 'Luzid snapshot.getSnaphotableAccounts')
  }

  /**
   * Lists all snapshots that have been created with Luzid.
   */
  async listSnapshots(): Promise<SnapshotRestoreListSnapshotsResponse> {
    const req: SnapshotRestoreListSnapshotsRequest = {}
    const res = await this.client.snapshot.listSnapshots(req)
    return maybeThrow(res, 'Luzid snapshot.listSnapshots')
  }

  /**
   * Returns the information of all accounts that are in a snapshot.
   *
   * - **snapshotId**: the id of the snapshot to retrieve accounts from
   *
   * The returned accounts have the following properties:
   *
   * - **address**: the pubkey of the account
   * - **lamports**: the balance of the account
   * - **owner**: the owner of the account
   * - **bytes**: the number of bytes in the account
   * - **executable**: whether the account is executable
   * - **slot**: the slot in which the account was created
   */
  async retrieveAccountsInSnapshot(
    snapshotId: string
  ): Promise<Successful<SnapshotRestoreRetrieveAccountsInSnapshotResponse>> {
    const req: SnapshotRestoreRetrieveAccountsInSnapshotRequest = { snapshotId }
    const res = await this.client.snapshot.retrieveAccountsInSnapshot(req)
    return maybeThrow(res, 'Luzid snapshot.retrieveAccountsInSnapshot')
  }

  /**
   * Restores accounts from a snapshot.
   *
   * - **snapshotId**: the id of the snapshot to retrieve accounts from
   * - **accounts**: the accounts to restore
   */
  async restoreAccountsFromSnapshot(
    snapshotId: string,
    accounts: string[]
  ): Promise<Successful<SnapshotRestoreRestoreAccountsFromSnapshotResponse>> {
    const req: SnapshotRestoreRestoreAccountsFromSnapshotRequest = {
      snapshotId,
      accounts,
    }
    const res = await this.client.snapshot.restoreAccountsFromSnapshot(req)
    return maybeThrow(res, 'Luzid snapshot.restoreAccountsFromSnapshot')
  }
}
