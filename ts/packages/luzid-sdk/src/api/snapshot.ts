import {
  SnapshotCreateSnapshotRequest,
  SnapshotCreateSnapshotResult,
  SnapshotDeleteSnapshotRequest,
  SnapshotGetSnaphotableAccountsRequest,
  SnapshotMetadata,
  SnapshotListSnapshotsRequest,
  SnapshotRestoreAccountsFromSnapshotRequest,
  SnapshotRestoreResult,
  SnapshotRetrieveAccountsInSnapshotRequest,
  SnapshotRetrieveAccountsInSnapshotResponse,
  SnapshotSnapshotableAccount,
} from '@luzid/grpc'
import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'

export type SnapshotDeletedSnapshot = Omit<
  SnapshotMetadata,
  'createdAt' | 'updatedAt'
>

export class LuzidSnapshot {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Returns the pubkeys of accounts that can be snapshotted.
   *
   * @param **includeProgramAccounts**: whether to include program accounts
   */
  async getSnaphotableAccounts(
    includeProgramAccounts: boolean = false
  ): Promise<SnapshotSnapshotableAccount[]> {
    const req: SnapshotGetSnaphotableAccountsRequest = {
      includeProgramAccounts,
    }
    const res = await this.client.snapshot.getSnaphotableAccounts(req)
    return unwrap(res, 'Luzid snapshot.getSnaphotableAccounts').accounts
  }

  /**
   * Lists all snapshots that have been created with Luzid.
   */
  async listSnapshots(): Promise<Successful<SnapshotMetadata[]>> {
    const req: SnapshotListSnapshotsRequest = {}
    const res = await this.client.snapshot.listSnapshots(req)
    return unwrap(res, 'Luzid snapshot.listSnapshots').snapshots
  }

  /**
   * Creates a snapshot of the accounts specified.
   *
   * @param **snapshotName**: the name to give the snapshot
   * @param **accounts**: the accounts to include in the snapshot
   * @param **snapshotDescription**: an optional description of the snapshot
   *
   * @returns the id of the snapshot and the number of accounts included
   */
  async createSnapshot(
    snapshotName: string,
    accounts: string[],
    snapshotDescription?: string
  ): Promise<SnapshotCreateSnapshotResult> {
    const request: SnapshotCreateSnapshotRequest = {
      name: snapshotName,
      accounts,
      description: snapshotDescription,
    }
    const res = await this.client.snapshot.createSnapshot(request)
    return unwrap(res, 'Luzid snapshot.createSnapshot').result
  }

  /**
   * Deletes the snapshot with the given id if it exists.
   *
   * @param **snapshotId**: the id of the snapshot to delete
   *
   * @returns the id of the deleted snapshot
   */
  async deleteSnapshot(snapshotId: string): Promise<string> {
    const request: SnapshotDeleteSnapshotRequest = {
      snapshotId,
    }
    const res = await this.client.snapshot.deleteSnapshot(request)
    return unwrap(res, 'Luzid snapshot.deleteSnapshot').result.snapshotId
  }

  /**
   * Deletes all globally stored snaphots.
   *
   * @returns the metadata of each deleted snapshot
   */
  async deleteAllSnapshots(): Promise<SnapshotDeletedSnapshot[]> {
    const snapshots = await this.listSnapshots()
    for (const snapshot of snapshots) {
      await this.deleteSnapshot(snapshot.snapshotId)
    }
    return snapshots.map((s) => ({
      ...s,
      createdAt: undefined,
      updatedAt: undefined,
    }))
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
  ): Promise<Successful<SnapshotRetrieveAccountsInSnapshotResponse>> {
    const req: SnapshotRetrieveAccountsInSnapshotRequest = { snapshotId }
    const res = await this.client.snapshot.retrieveAccountsInSnapshot(req)
    return unwrap(res, 'Luzid snapshot.retrieveAccountsInSnapshot')
  }

  /**
   * s accounts from a snapshot.
   *
   * - **snapshotId**: the id of the snapshot to retrieve accounts from
   * - **accounts**: the accounts to restore
   */
  async restoreAccountsFromSnapshot(
    snapshotId: string,
    accounts: string[]
  ): Promise<SnapshotRestoreResult> {
    const req: SnapshotRestoreAccountsFromSnapshotRequest = {
      snapshotId,
      accounts,
    }
    const res = await this.client.snapshot.restoreAccountsFromSnapshot(req)
    return unwrap(res, 'Luzid snapshot.restoreAccountsFromSnapshot').result
  }
}
