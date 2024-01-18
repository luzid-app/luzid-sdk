import {
  Cluster,
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
  clusterToJSON,
} from '@luzid/grpc'
import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { assert } from '../core/assert'

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
}
