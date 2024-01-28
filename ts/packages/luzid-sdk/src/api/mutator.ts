import {
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
  MutatorModifyAccountRequest,
  MutatorModifyAccountResponse,
  RpcAccountModification,
  RpcModifyAccountOpts,
} from '@luzid/grpc'
import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { assert } from '../core/assert'
import { Successful, unwrap } from '../core/utils'
import { Cluster, LuzidCluster, intoGrpcCluster } from '../api-types/cluster'

type AccountModificationBuilder = {
  setLamports(lamports: bigint): AccountModificationBuilder
  setOwner(owner: string): AccountModificationBuilder
  setExecutable(executable: boolean): AccountModificationBuilder

  setData(
    data: Uint8Array,
    opts?: { size?: number }
  ): AccountModificationBuilder
  setRentEpoch(rentEpoch: bigint): AccountModificationBuilder
}

export class AccountModification implements RpcAccountModification {
  private _lamports?: bigint
  private _owner?: string
  private _executable?: boolean
  private _data?: Uint8Array
  private _rentEpoch?: bigint

  private constructor(public readonly accountAddress: string) {}

  static forAddr(accountAddress: string): AccountModificationBuilder {
    return new AccountModification(accountAddress)
  }

  get lamports() {
    return this._lamports
  }
  setLamports(lamports: bigint): AccountModificationBuilder {
    this._lamports = lamports
    return this
  }

  get owner() {
    return this._owner
  }
  setOwner(owner: string): AccountModificationBuilder {
    this._owner = owner
    return this
  }

  get executable() {
    return this._executable
  }
  setExecutable(executable: boolean): AccountModificationBuilder {
    this._executable = executable
    return this
  }

  get data() {
    return this._data
  }

  /**
   * Sets the data for the account.
   *
   * In some cases it is important to ensure the data has a specific size.
   * As an example anchor's `program.coder.encode()` will encode the data but not ensure
   * it has a compatible size
   *
   * In that case one has to do the following, assuming we're encoding a `Game` account that
   * is defined at index `0` in the IDL accounts array:
   *
   * ```typescript
   * const data = await program.coder.accounts.encode('Game', gameState)
   * const gameAccountDef = program.idl.accounts[0]
   * const size = program.coder.accounts.size(gameAccountDef)
   * return luzid.mutator.modifyAccount(
   *   AccountModification.forAddr(gameKeypair.publicKey.toBase58()).setData(
   *     data,
   *     { size }
   *   )
   * )
   * ```
   *
   * @param data - the data to set
   * @param opts - optional parameters
   * @param opts -ze**: the size of the data to set. If not provided, the data will be set as is.
   */
  setData(
    data: Uint8Array,
    opts?: { size?: number }
  ): AccountModificationBuilder {
    if (opts?.size != null && opts.size !== data.length) {
      assert(
        data.length <= opts.size,
        `When providing opts.size it has to be smaller or equal to data.length.\n` +
          `However opts.size: ${opts.size} is smaller than the data size: ${data.length} bytes.`
      )
      const buf = new Uint8Array(opts.size)
      buf.set(data, 0)
      this._data = buf
    } else {
      this._data = data
    }
    return this
  }

  get rentEpoch() {
    return this._rentEpoch
  }
  setRentEpoch(rentEpoch: bigint): AccountModificationBuilder {
    this._rentEpoch = rentEpoch
    return this
  }
}

export class LuzidMutator {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Clones an account.
   *
   * @param cluster - the cluster to clone the account from (MainnetBeta or Devnet)
   * @param address - the pubkey of the account to clone
   */
  async cloneAccount(
    cluster: LuzidCluster,
    address: string
  ): Promise<Successful<MutatorCloneAccountResponse>> {
    assert(
      cluster == Cluster.Devnet || cluster == Cluster.MainnetBeta,
      `Invalid cluster ${cluster.toJSON()}.\nAt this point accounts can only be cloned from MainnetBeta or Devnet.`
    )
    const req: MutatorCloneAccountRequest = {
      cluster: intoGrpcCluster(cluster),
      address,
    }
    const res = await this.client.mutator.cloneAccount(req)
    return unwrap(res, 'Luzid mutator.cloneAccount')
  }

  async modifyAccount(
    modification: AccountModification | AccountModificationBuilder,
    ensureRentExempt = true
  ): Promise<Successful<MutatorModifyAccountResponse>> {
    const opts: RpcModifyAccountOpts = {
      ensureRentExempt,
      createPseudoTransaction: true,
    }
    const req: MutatorModifyAccountRequest = {
      // Using `as` here so that the user can pass in an AccountModificationBuilder which we know
      // is always an AccountModification exposed via the builder interface.
      // The other option would be to have the user call `build` which is not quite as nice.
      modification: modification as AccountModification,
      opts,
    }
    const res = await this.client.mutator.modifyAccount(req)
    return unwrap(res, 'Luzid mutator.modifyAccount')
  }
}
