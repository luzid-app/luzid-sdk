import { TransactionModificationLabeled } from '@luzid/grpc'
import {
  LabelTransactionRequest,
  LabelTransactionResponse,
  TransactionServiceClient,
  TransactionServiceDefinition,
  TransactionSubClient,
  TransactionSubDefinition,
  RpcTransactionUpdate,
  TransactionModifiedSubClient,
  TransactionModifiedSubDefinition,
} from '@luzid/grpc'
import { Channel, createClient } from '@luzid/grpc-connection'

// -----------------
// TransactionRequestClient
// -----------------
class TransactionRequestClient {
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

// -----------------
// TransactionSubClient
// -----------------
class _TransactionSubClient {
  private readonly client: TransactionSubClient

  constructor(channel: Channel) {
    this.client = createClient(TransactionSubDefinition, channel)
  }

  subTransactions(): AsyncIterable<RpcTransactionUpdate> {
    return this.client.subTransactions({})
  }
}

// -----------------
// TransactionModifiedSubClient
// -----------------
class _TransactionModifiedSubClient {
  private readonly client: TransactionModifiedSubClient

  constructor(channel: Channel) {
    this.client = createClient(TransactionModifiedSubDefinition, channel)
  }

  subTransactionLabeled(): AsyncIterable<TransactionModificationLabeled> {
    return this.client.subTransactionLabeled({})
  }
}

// -----------------
// Consolidated TransactionClient
// -----------------
export class TransactionClient {
  private readonly request: TransactionRequestClient
  private readonly transactionSub: _TransactionSubClient
  private readonly transactionModifiedSub: _TransactionModifiedSubClient

  constructor(channel: Channel) {
    this.request = new TransactionRequestClient(channel)
    this.transactionSub = new _TransactionSubClient(channel)
    this.transactionModifiedSub = new _TransactionModifiedSubClient(channel)
  }

  labelTransaction(
    request: LabelTransactionRequest
  ): Promise<LabelTransactionResponse> {
    return this.request.labelTransaction(request)
  }

  subTransactions(): AsyncIterable<RpcTransactionUpdate> {
    return this.transactionSub.subTransactions()
  }

  subTransactionLabeled(): AsyncIterable<TransactionModificationLabeled> {
    return this.transactionModifiedSub.subTransactionLabeled()
  }
}
