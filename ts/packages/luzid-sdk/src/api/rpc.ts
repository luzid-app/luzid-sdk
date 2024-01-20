import {
  Cluster,
  RpcGetAccountInfoRequest,
  RpcGetAccountInfoResponse,
  RpcRequestAirdropRequest,
  RpcRequestAirdropResponse,
  clusterToJSON,
} from '@luzid/grpc'
import { LuzidGrpcClient } from '@luzid/grpc-client'
import { assert } from '../core/assert'
import { Successful, maybeThrow } from '../core/utils'

export class LuzidRpc {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Returns the info for an account.
   *
   * @param **cluster**: the cluster to query
   * @param **address**: the pubkey of the account
   *
   * The returned account has the following properties:
   *
   * - **owner**: the owner of the account
   * - **data**: the data of the account
   * - **executable**: whether the account is executable
   * - **lamports**: the balance of the account
   * - **rentEpoch**: the rent epoch of the account
   */
  async getAccountInfo(
    cluster: Cluster,
    address: string
  ): Promise<Successful<RpcGetAccountInfoResponse>> {
    const req: RpcGetAccountInfoRequest = { cluster, address }
    const res = await this.client.rpc.getAccountInfo(req)
    return maybeThrow(res, 'Luzid rpc.getAccountInfo')
  }

  /**
   * Requests to drop SOL to an account.
   *
   * @param **cluster**: the cluster to drop SOL to
   * @param **address**: the pubkey of the account to fund
   * @param **solAmount**: the amount of SOL to drop
   */
  async requestAirdrop(
    cluster: Cluster,
    address: string,
    solAmount: number
  ): Promise<Successful<RpcRequestAirdropResponse>> {
    assert(
      cluster == Cluster.Development,
      `Invalid cluster ${clusterToJSON(
        cluster
      )}. Luzid can only airdrop to the Development cluster.`
    )
    const req: RpcRequestAirdropRequest = { cluster, address, solAmount }
    const res = await this.client.rpc.requestAirdrop(req)
    return maybeThrow(res, 'Luzid rpc.requestAirdrop')
  }
}
