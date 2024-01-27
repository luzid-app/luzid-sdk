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
  SnapshotSnapshotableAccount,
} from '@luzid/grpc'
import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'
import { SnapshotAccountSummary } from '@luzid/grpc'
import { SnapshotRestoreAccountsFromLastUpdatedSnapshotRequest } from '@luzid/grpc'

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
  async listSnapshots(): Promise<SnapshotMetadata[]> {
    const req: SnapshotListSnapshotsRequest = {}
    const res = await this.client.snapshot.listSnapshots(req)
    return unwrap(res, 'Luzid snapshot.listSnapshots').snapshots
  }

  /**
   * Creates a snapshot of the accounts specified.
   *
   * @param **snapshotName**: the name to give the snapshot
   * @param **accounts**: the accounts to include in the snapshot
   * @param **opts**: optional parameters to control the snapshot creation
   * @param **opts.description**: description of the snapshot
   * @param **opts.group**: group of the snapshot
   *
   * @returns the id of the snapshot and the number of accounts included
   */
  async createSnapshot(
    snapshotName: string,
    accounts: string[],
    opts: { description?: string; group?: string } = {}
  ): Promise<SnapshotCreateSnapshotResult> {
    const request: SnapshotCreateSnapshotRequest = {
      name: snapshotName,
      accounts,
      description: opts.description,
      group: opts.group,
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
   * @param **address**: the pubkey of the account
   * @param **lamports**: the balance of the account
   * @param **owner**: the owner of the account
   * @param **bytes**: the number of bytes in the account
   * @param **executable**: whether the account is executable
   * @param **slot**: the slot in which the account was created
   */
  async retrieveAccountsInSnapshot(
    snapshotId: string
  ): Promise<SnapshotAccountSummary[]> {
    const req: SnapshotRetrieveAccountsInSnapshotRequest = { snapshotId }
    const res = await this.client.snapshot.retrieveAccountsInSnapshot(req)
    return unwrap(res, 'Luzid snapshot.retrieveAccountsInSnapshot').accounts
  }

  /**
   * Restores accounts from a snapshot.
   *
   * @param **snapshotId**: the id of the snapshot to retrieve accounts from
   * @param **opts**: optional parameters to control the restore process
   * @param **opts.accounts**: the accounts to restore, not provided all accounts inside the snapshot will be restored
   * @param **opts.deleteSnapshotAfterRestore**: whether to delete the snapshot after it was restored
   */
  async restoreAccountsFromSnapshot(
    snapshotId: string,
    opts?: {
      accounts?: string[]
      deleteSnapshotAfterRestore: boolean
    }
  ): Promise<Successful<SnapshotRestoreResult>> {
    const { deleteSnapshotAfterRestore = false, accounts } = opts ?? {}

    const req: SnapshotRestoreAccountsFromSnapshotRequest = {
      snapshotId,
      accounts: accounts != null ? { items: accounts } : undefined,
    }
    const res = await this.client.snapshot.restoreAccountsFromSnapshot(req)
    const result = unwrap(
      res,
      'Luzid snapshot.restoreAccountsFromSnapshot'
    ).result
    if (deleteSnapshotAfterRestore) {
      await this.deleteSnapshot(result.snapshotId)
    }
    return result
  }

  /**
   * Restores accounts from the snapshot that was updated most recently.
   *
   * @param **snapshotId**: the id of the snapshot to retrieve accounts from
   * @param **opts**: optional parameters to control the restore process
   * @param **opts.accounts**: the accounts to restore, not provided all accounts inside the snapshot will be restored
   * @param **opts.deleteSnapshotAfterRestore**: whether to delete the snapshot after it was restored
   */
  async restoreAccountsFromLastUpdatedSnapshot(opts?: {
    accounts?: string[]
    deleteSnapshotAfterRestore: boolean
  }): Promise<Successful<SnapshotRestoreResult>> {
    const { deleteSnapshotAfterRestore = false, accounts } = opts ?? {}

    const req: SnapshotRestoreAccountsFromLastUpdatedSnapshotRequest = {
      accounts: accounts != null ? { items: accounts } : undefined,
    }
    const res =
      await this.client.snapshot.restoreAccountsFromLastUpdatedSnapshot(req)
    const result = unwrap(
      res,
      'Luzid snapshot.restoreAccountsFromLastUpdatedSnapshot'
    ).result
    if (deleteSnapshotAfterRestore) {
      await this.deleteSnapshot(result.snapshotId)
    }
    return result
  }
}
