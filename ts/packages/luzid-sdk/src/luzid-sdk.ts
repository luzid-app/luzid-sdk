import { LuzidGrpcClient, LuzidGrpcClientOpts } from '@luzid/grpc-client'
import { LuzidApp } from './api/app'
import { LuzidMeta } from './api/meta'
import { LuzidMutator } from './api/mutator'
import { LuzidPing } from './api/ping'
import { LuzidRpc } from './api/rpc'
import { LuzidSnapshot } from './api/snapshot'
import { LuzidStore } from './api/store'
import { LuzidTransaction } from './api/transaction'
import { LuzidValidator } from './api/validator'
import { LuzidWorkspace } from './api/workspace'

export * from './api/app'
export * from './api/meta'
export * from './api/mutator'
export * from './api/ping'
export * from './api/rpc'
export * from './api/snapshot'
export * from './api/store'
export * from './api/validator'
export { SolanaEndpoint, LuzidCluster, Cluster } from './api-types/cluster'

export type LuzidSdkOpts = {
  client?: LuzidGrpcClientOpts
}

export class LuzidSdk {
  private readonly client: LuzidGrpcClient
  private readonly _app: LuzidApp
  private readonly _meta: LuzidMeta
  private readonly _mutator: LuzidMutator
  private readonly _ping: LuzidPing
  private readonly _rpc: LuzidRpc
  private readonly _snapshot: LuzidSnapshot
  private readonly _store: LuzidStore
  private readonly _transaction: LuzidTransaction
  private readonly _validator: LuzidValidator
  private readonly _workspace: LuzidWorkspace

  constructor(opts?: LuzidSdkOpts) {
    this.client = new LuzidGrpcClient(opts?.client)

    this._app = new LuzidApp(this.client)
    this._meta = new LuzidMeta(this.client)
    this._mutator = new LuzidMutator(this.client)
    this._ping = new LuzidPing(this.client)
    this._rpc = new LuzidRpc(this.client)
    this._snapshot = new LuzidSnapshot(this.client)
    this._store = new LuzidStore(this.client)
    this._transaction = new LuzidTransaction(this.client)
    this._validator = new LuzidValidator(this.client)
    this._workspace = new LuzidWorkspace(this.client)
  }

  /**
   * Provides access to the Luzid App service with the following methods:
   *
   * **appOps** - Controls the Luzid App, i.e to shut it down.
   */
  get app() {
    return this._app
  }

  /**
   * Provides access to the Luzid Mutator service with the following methods:
   *
   * **cloneAccount** - Clones an account.
   * **modifyAccount** - Modifies an account.
   */
  get mutator() {
    return this._mutator
  }

  /**
   * Provides access to the Luzid Meta service with the following methods:
   *
   * **getMeta** - Returns the meta information for the Luzid backend.
   */
  get meta() {
    return this._meta
  }

  /**
   * Provides access to the Ping client which is used to ensure that the Luzid
   * backend is up via the following methods:
   *
   * - **ping**: Online backend will reply with `{ pong: true }`
   */
  get ping() {
    return this._ping
  }

  /**
   * Provides access to the Luzid RPC service with the following methods:
   *
   * **getAccountInfo** - Returns the info for an account.
   * **requestAirdrop** - Requests to drop SOL to an account.
   */
  get rpc() {
    return this._rpc
  }

  /**
   * Provides access to the Luzid Snapshot service with the following methods:
   *
   * **getSnaphotableAccounts** - Returns a list of accounts that can be snapshotted.
   * **listSnapshots** - Returns a list of snapshots created previously.
   * **retrieveAccountsInSnapshot** - Returns a list of accounts in a snapshot.
   * **restoreAccountsFromSnapshot** - Restores specific accounts from a snapshot.
   */
  get snapshot() {
    return this._snapshot
  }

  /**
   * Provides access to the Luzid Store service with the following methods:
   *
   * **getAccountData** - Returns the data for an account.
   * **getDiffedAccountUpdate** - Returns the diffed account update for an account related to a transaction.
   */
  get store() {
    return this._store
  }

  /**
   * Provides access to the Luzid Transaction service with the following methods:
   *
   * **labelTransaction** - Labels a transaction.
   */
  get transaction() {
    return this._transaction
  }

  /**
   * Provides access to the Luzid Validator service with the following methods:
   *
   * **validatorOps** - Allows to Start/Stop/Restart the validator.
   * **subValidatorStatus** - Subscribes to validator status updates.
   * **subValidatorInfo** - Subscribes to validator info updates.
   * **subValidatorStats** - Subscribes to validator stats updates.
   * **getValidatorStatus** - Gets next available validator status update.
   * **getValidatorInfo** - Gets next available validator info update.
   * **getValidatorStats** - Gets next available validator stats update.
   */
  get validator() {
    return this._validator
  }

  /**
   * Provides access to the Luzid Workspace service with the following methods:
   *
   * **getWorkspace** - Returns the workspace at the given root.
   * **cloneWorkspace** - Clones the workspace at the given root.
   * **watchWorkspace** - Watches the workspace at the given root after cloning it into the validator.
   * **unwatchWorkspace** - Stops watching the workspace at the given root.
   * **addWorkspace** - Adds a workspace to the list of workspaces that are available to be cloned or watched from the Workspace tab in the Luzid UI.
   * **removeWorkspace** - Removes a workspace from the list of workspaces that are available to be cloned or watched from the Workspace tab in the Luzid UI.
   * **listWorkspaces** - Returns a list of workspaces that are available to be cloned or watched from the Workspace tab in the Luzid UI.
   */
  get workspace() {
    return this._workspace
  }
}
