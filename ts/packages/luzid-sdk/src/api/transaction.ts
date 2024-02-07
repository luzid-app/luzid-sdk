import { LabelTransactionRequest } from '@luzid/grpc'
import { LuzidGrpcClient } from '@luzid/grpc-client'
import { Successful, unwrap } from '../core/utils'

export class LuzidTransaction {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Labels a transaction to help identifying it inside the Luzid UI.
   * NOTE: that this is a Luzid only feature and does not affect how explores display
   * the transaction.
   *
   * @param signature - The signature of the transaction to label
   * @param label - The label to apply to the transaction
   */
  async labelTransaction(
    signature: string,
    label: string
  ): Promise<Successful<void>> {
    const req: LabelTransactionRequest = { signature, label }
    const res = await this.client.transaction.labelTransaction(req)
    return unwrap(res, 'Luzid transaction.label')
  }
}
