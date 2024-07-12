import {
  LabelTransactionRequest,
  LabelTransactionResponse,
  RpcTransactionUpdate,
  TransactionModificationLabeled,
} from '@luzid/grpc'
import { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'

export {
  RpcTransactionUpdate,
  TransactionModificationLabeled,
} from '@luzid/grpc'

export class LuzidTransaction {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Labels a transaction to help identifying it inside the Luzid UI.
   * NOTE: that this is a Luzid only feature and does not affect how explorers display
   * the transaction.
   *
   * @param signature - The signature of the transaction to label
   * @param label - The label to apply to the transaction
   */
  async labelTransaction(
    signature: string,
    label: string
  ): Promise<Successful<LabelTransactionResponse>> {
    const req: LabelTransactionRequest = { signature, label }
    const res = await this.client.transaction.labelTransaction(req)
    return unwrap(res, 'Luzid transaction.label')
  }

  /**
   * Subscribes to transaction updates, i.e. when a new transaction
   * is created.
   */
  subTransactions(): AsyncIterable<RpcTransactionUpdate> {
    return this.client.transaction.subTransactions()
  }

  /**
   * Subscribes to transaction labeling events.
   */
  subTransactionLabeled(): AsyncIterable<TransactionModificationLabeled> {
    return this.client.transaction.subTransactionLabeled()
  }
}
