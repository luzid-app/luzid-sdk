import {
  StoreGetAccountDataRequest,
  StoreGetAccountDataResponse,
  StoreGetDiffedAccountUpdateRequest,
  StoreGetDiffedAccountUpdateResponse,
} from '@luzid/grpc'

import type { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'

export class LuzidStore {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Returns the data for an account.
   *
   * @param pubkey - The pubkey of the account we are intrested in
   */
  async getAccountData(
    pubkey: string
  ): Promise<Successful<StoreGetAccountDataResponse>> {
    const req: StoreGetAccountDataRequest = { pubkey }
    const res = await this.client.store.getAccountData(req)
    return unwrap(res, 'Luzid store.getAccountData')
  }

  /**
   * Returns the update to an account resulting from a specific transaction.
   *
   * @param pubkey - The pubkey of the account we are intrested in
   * @param transactionSignature - The transaction that caused the account update
   */
  async getDiffedAccountUpdate(
    pubkey: string,
    transactionSignature: string
  ): Promise<Successful<StoreGetDiffedAccountUpdateResponse>> {
    const req: StoreGetDiffedAccountUpdateRequest = {
      pubkey,
      transactionSignature,
    }
    const res = await this.client.store.getDiffedAccountUpdate(req)
    return unwrap(res, 'Luzid store.getDiffedAccountUpdate')
  }
}
