import {
  LabelTransactionRequest,
  LabelTransactionResponse,
  TransactionServiceClient,
  TransactionServiceDefinition,
} from '@luzid/grpc'
import { Channel, createClient } from '@luzid/grpc-connection'

// -----------------
// TransactionClient
// -----------------
export class TransactionClient {
  private readonly client: TransactionServiceClient

  constructor(channel: Channel) {
    this.client = createClient(TransactionServiceDefinition, channel)
  }

  labelTransaction(
    request: LabelTransactionRequest
  ): Promise<LabelTransactionResponse> {
    return this.client.labelTransaction(request)
  }
}
