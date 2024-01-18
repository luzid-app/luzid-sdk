import { LuzidGrpcClient, LuzidGrpcClientOpts } from '@luzid/grpc-client'
import { LuzidApp } from './api/app'
import { LuzidMutator } from './api/mutator'
import { LuzidRpc } from './api/rpc'
import { LuzidSnapshot } from './api/snapshot'
import { LuzidStore } from './api/store'
import { LuzidValidator } from './api/validator'

export type LuzidSdkOpts = {
  client?: LuzidGrpcClientOpts
}

export class LuzidSdk {
  private readonly client: LuzidGrpcClient
  private readonly _app: LuzidApp
  private readonly _mutator: LuzidMutator
  private readonly _rpc: LuzidRpc
  private readonly _snapshot: LuzidSnapshot
  private readonly _store: LuzidStore
  private readonly _validator: LuzidValidator

  constructor(opts?: LuzidSdkOpts) {
    this.client = new LuzidGrpcClient(opts?.client)
    this._app = new LuzidApp(this.client)
    this._mutator = new LuzidMutator(this.client)
    this._rpc = new LuzidRpc(this.client)
    this._snapshot = new LuzidSnapshot(this.client)
    this._store = new LuzidStore(this.client)
    this._validator = new LuzidValidator(this.client)
  }

  /**
   * Provides access to the Luzid App service with the following methods:
   *
   * - **appOps**: Controls the Luzid App, i.e to shut it down.
   */
  get app() {
    return this._app
  }

  /**
   * Provides access to the Luzid Mutator service with the following methods:
   *
   * - **cloneAccount**: Clones an account.
   */
  get mutator() {
    return this._mutator
  }

  /**
   * Provides access to the Luzid RPC service with the following methods:
   *
   * - **getAccountInfo**: Returns the info for an account.
   *  - **requestAirdrop**: Requests to drop SOL to an account.
   */
  get rpc() {
    return this._rpc
  }

  /**
   * Provides access to the Luzid Snapshot service with the following methods:
   *
   * - **getSnaphotableAccounts**: Returns a list of accounts that can be snapshotted.
   * - **listSnapshots**: Returns a list of snapshots created previously.
   * - **retrieveAccountsInSnapshot**: Returns a list of accounts in a snapshot.
   * - **restoreAccountsFromSnapshot**: Restores specific accounts from a snapshot.
   */
  get snapshot() {
    return this._snapshot
  }

  /**
   * Provides access to the Luzid Store service with the following methods:
   *
   * - **getAccountData**: Returns the data for an account.
   * - **getDiffedAccountUpdate**: Returns the diffed account update for an account related to a transaction.
   */
  get store() {
    return this._store
  }

  /**
   * Provides access to the Luzid Validator service with the following methods:
   *
   * - **validatorOps**: Allows to Start/Stop/Restart the validator.
   */
  get validator() {
    return this._validator
  }
}
