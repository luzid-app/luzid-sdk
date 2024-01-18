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

export class LuzidSnapshot {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Returns the pubkeys of accounts that can be snapshotted.
   *
   * @param **includeProgramAccounts**: whether to include program accounts
   */
  async getSnaphotableAccounts(
    includeProgramAccounts: boolean = false
  ): Promise<Omit<SnapshotManagementGetSnaphotableAccountsResponse, 'error'>> {
    const req: SnapshotManagementGetSnaphotableAccountsRequest = {
      includeProgramAccounts,
    }
    const res = await this.client.snapshot.getSnaphotableAccounts(req)
    if (res.error != null) {
      throw new Error(
        `Luzid snapshot.getSnaphotableAccounts returned an error:\n${res.error}`
      )
    } else {
      return res
    }
  }

  /**
   * Lists all snapshots that have been created with Luzid.
   */
  async listSnapshots(): Promise<SnapshotRestoreListSnapshotsResponse> {
    const req: SnapshotRestoreListSnapshotsRequest = {}
    const res = await this.client.snapshot.listSnapshots(req)
    if (res.error != null) {
      throw new Error(
        `Luzid snapshot.listSnapshots returned an error:\n${res.error}`
      )
    } else {
      return res
    }
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
  ): Promise<SnapshotRestoreRetrieveAccountsInSnapshotResponse> {
    const req: SnapshotRestoreRetrieveAccountsInSnapshotRequest = { snapshotId }
    const res = await this.client.snapshot.retrieveAccountsInSnapshot(req)
    if (res.error != null) {
      throw new Error(
        `Luzid snapshot.retrieveAccountsInSnapshot returned an error:\n${res.error}`
      )
    } else {
      return res
    }
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
  ): Promise<SnapshotRestoreRestoreAccountsFromSnapshotResponse> {
    const req: SnapshotRestoreRestoreAccountsFromSnapshotRequest = {
      snapshotId,
      accounts,
    }
    const res = await this.client.snapshot.restoreAccountsFromSnapshot(req)
    if (res.error != null) {
      throw new Error(
        `Luzid snapshot.restoreAccountsFromSnapshot returned an error:\n${res.error}`
      )
    } else {
      return res
    }
  }
}
