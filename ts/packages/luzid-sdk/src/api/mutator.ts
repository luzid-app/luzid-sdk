import {
  Cluster,
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
  MutatorModifyAccountRequest,
  RpcAccountModification,
  RpcModifyAccountOpts,
  clusterToJSON,
} from '@luzid/grpc'
import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { assert } from '../core/assert'

export class AccountModification implements RpcAccountModification {
  public _lamports?: bigint
  public _owner?: string
  public _executable?: boolean
  public _data?: Uint8Array
  public _rentEpoch?: bigint

  private constructor(public readonly accountAddress: string) {}

  static create(accountAddress: string) {
    return new AccountModification(accountAddress)
  }

  get lamports() {
    return this._lamports
  }
  setLamports(lamports: bigint) {
    this._lamports = lamports
    return this
  }

  get owner() {
    return this._owner
  }
  setOwner(owner: string) {
    this._owner = owner
    return this
  }

  get executable() {
    return this._executable
  }
  setExecutable(executable: boolean) {
    this._executable = executable
    return this
  }

  get data() {
    return this._data
  }
  setData(data: Uint8Array) {
    this._data = data
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
    cluster: Cluster,
    address: string
  ): Promise<Omit<MutatorCloneAccountResponse, 'error'>> {
    assert(
      cluster == Cluster.Devnet || cluster == Cluster.MainnetBeta,
      `Invalid cluster ${clusterToJSON(
        cluster
      )}.\nAt this point accounts can only be cloned from MainnetBeta or Devnet.`
    )
    const req: MutatorCloneAccountRequest = { cluster, address }
    const res = await this.client.mutator.cloneAccount(req)
    if (res.error != null) {
      throw new Error(
        `Luzid mutator.cloneAccount returned an error:\n${res.error}`
      )
    } else {
      return res
    }
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
   * const modification = AccountModification.create('<pubkey>')
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
    modification: AccountModification,
    ensureRentExempt = true
  ) {
    const opts: RpcModifyAccountOpts = {
      ensureRentExempt,
      createPseudoTransaction: true,
    }
    const req: MutatorModifyAccountRequest = { modification, opts }
    const res = await this.client.mutator.modifyAccount(req)
    if (res.error != null) {
      throw new Error(
        `Luzid mutator.modifyAccount returned an error:\n${res.error}`
      )
    } else {
      return res
    }
  }
}
