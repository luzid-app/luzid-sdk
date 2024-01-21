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
import { Successful, maybeThrow } from '../core/utils'
import { Cluster, LuzidCluster, intoGrpcCluster } from '../api-types/cluster'

type AccountModificationBuilder = {
  setLamports(lamports: bigint): AccountModificationBuilder
  setOwner(owner: string): AccountModificationBuilder
  setExecutable(executable: boolean): AccountModificationBuilder
  setData(data: Uint8Array): AccountModificationBuilder
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
  setData(data: Uint8Array): AccountModificationBuilder {
    this._data = data
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
   * @param **cluster**: the cluster to clone the account from (MainnetBeta or Devnet)
   * @param **address**: the pubkey of the account to clone
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
    return maybeThrow(res, 'Luzid mutator.cloneAccount')
  }

  /**
   * Modifies an account by overriding the fields specified in the modification.
   * The non-specified fields will be left untouched.
   *
   * Create an AccountModification via the `create` and override the desired fields.
   *
   * ### Example
   *
   * ```typescript
   * const modification = AccountModification.forAddr('<pubkey>')
   *   .setLamports(2n)
   *   .setOwner('<owner pubkey>')
   *   .setExecutable(false)
   * ```
   *
   * @param **modification**: the account modification to apply
   * @param **ensureRentExempt**: whether to ensure the account is rent exempt
   *                              even if the provided lamports would not be enough
   */
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
      // The other option would be to have the user call `build` which is now quite as nice.
      modification: modification as AccountModification,
      opts,
    }
    const res = await this.client.mutator.modifyAccount(req)
    return maybeThrow(res, 'Luzid mutator.modifyAccount')
  }
}
