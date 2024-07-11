import { AppClient } from './client/app'
import { MutatorClient } from './client/mutator'
import { RpcClient } from './client/rpc'
import { SnapshotClient } from './client/snapshot'
import { StoreClient } from './client/store'
import { ValidatorClient } from './client/validator'
import {
  Channel,
  createChannel,
  createLocalChannel,
} from '@luzid/grpc-connection'
import { assert } from './core/assert'
import { TransactionClient } from './client/transaction'
import { WorkspaceClient } from './client/workspace'
import { PingClient } from './client/ping'

const DEFAULT_GRPC_SERVER_PORT = 60061

export type LuzidGrpcClientOpts = {
  url?: string
  port?: number
}

export class LuzidGrpcClient {
  private readonly channel: Channel
  private _app?: AppClient
  private _ping?: PingClient
  private _mutator?: MutatorClient
  private _rpc?: RpcClient
  private _snapshot?: SnapshotClient
  private _store?: StoreClient
  private _validator?: ValidatorClient
  private _transaction?: TransactionClient
  private _workspace?: WorkspaceClient

  constructor(opts?: LuzidGrpcClientOpts) {
    if (opts?.url != null) {
      assert(opts.port == null, 'Cannot specify both url and port')
      this.channel = createChannel(opts.url)
    } else {
      const port = opts?.port ?? DEFAULT_GRPC_SERVER_PORT
      this.channel = createLocalChannel(port)
    }
  }

  /**
   * Provides access to the Luzid App service with the following methods:
   *
   * - **appOps**: Controls the Luzid App, i.e to shut it down.
   */
  get app() {
    if (this._app == null) {
      this._app = new AppClient(this.channel)
    }
    return this._app
  }

  /**
   * Provides access to the Luzid Mutator service with the following methods:
   *
   * - **cloneAccount**: Clones an account.
   */
  get mutator() {
    if (this._mutator == null) {
      this._mutator = new MutatorClient(this.channel)
    }
    return this._mutator
  }

  /**
   * Provides access to the Ping client which is used to ensure that the Luzid
   * backend is up via the following methods:
   *
   * - **ping**: Online backend will reply with `{ pong: true }`
   */
  get ping() {
    if (this._ping == null) {
      this._ping = new PingClient(this.channel)
    }
    return this._ping
  }

  /**
   * Provides access to the Luzid RPC service with the following methods:
   *
   * - **getAccountInfo**: Returns the info for an account.
   *  - **requestAirdrop**: Requests to drop SOL to an account.
   */
  get rpc() {
    if (this._rpc == null) {
      this._rpc = new RpcClient(this.channel)
    }
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
    if (this._snapshot == null) {
      this._snapshot = new SnapshotClient(this.channel)
    }
    return this._snapshot
  }

  /**
   * Provides access to the Luzid Store service with the following methods:
   *
   * - **getAccountData**: Returns the data for an account.
   * - **getDiffedAccountUpdate**: Returns the diffed account update for an account related to a transaction.
   */
  get store() {
    if (this._store == null) {
      this._store = new StoreClient(this.channel)
    }
    return this._store
  }

  /**
   * Provides access to the Luzid Validator service with the following methods:
   *
   * - **validatorOps**: Allows to Start/Stop/Restart the validator.
   */
  get validator() {
    if (this._validator == null) {
      this._validator = new ValidatorClient(this.channel)
    }
    return this._validator
  }

  /**
   * Provides access to the Luzid Transaction service with the following methods:
   *
   * - **labelTransaction**: Labels a transaction
   */
  get transaction() {
    if (this._transaction == null) {
      this._transaction = new TransactionClient(this.channel)
    }
    return this._transaction
  }

  /**
   * Provides access to the Luzid Workspace service with the following methods:
   *
   * - **getWorkspace**: Returns the workspace for a given workspace root.
   * - **cloneWorkspace**: Clones a workspace.
   * - **watchWorkspace**: Watches a workspace.
   * - **unwatchWorkspace**: Unwatches a workspace.
   * - **addWorkspace**: Adds a workspace.
   * - **removeWorkspace**: Removes a workspace.
   */
  get workspace() {
    if (this._workspace == null) {
      this._workspace = new WorkspaceClient(this.channel)
    }
    return this._workspace
  }
}
