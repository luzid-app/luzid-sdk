import {
  StoreGetAccountDataRequest,
  StoreGetAccountDataResponse,
  StoreGetDiffedAccountUpdateRequest,
  StoreGetDiffedAccountUpdateResponse,
} from '@luzid/grpc'

import type { LuzidGrpcClient } from '@luzid/grpc-client'

export class LuzidStore {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Returns the data for an account.
   *
   * - **pubkey**: The pubkey of the account we are intrested in
   */
  async getAccountData(
    pubkey: string
  ): Promise<Omit<StoreGetAccountDataResponse, 'error'>> {
    const req: StoreGetAccountDataRequest = { pubkey }
    const res = await this.client.store.getAccountData(req)
    if (res.error != null) {
      throw new Error(
        `Luzid store.getAccountData returned an error:\n${res.error}`
      )
    } else {
      return res
    }
  }

  /**
   * Returns the update to an account resulting from a specific transaction.
   *
   * - **pubkey**: The pubkey of the account we are intrested in
   * - **transactionSignature**: The transaction that caused the account update
   */
  async getDiffedAccountUpdate(
    pubkey: string,
    transactionSignature: string
  ): Promise<Omit<StoreGetDiffedAccountUpdateResponse, 'error'>> {
    const req: StoreGetDiffedAccountUpdateRequest = {
      pubkey,
      transactionSignature,
    }
    const res = await this.client.store.getDiffedAccountUpdate(req)
    if (res.error != null) {
      throw new Error(
        `Luzid store.getDiffedAccountUpdate returned an error:\n${res.error}`
      )
    } else {
      return res
    }
  }
}
