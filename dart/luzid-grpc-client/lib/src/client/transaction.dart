import 'package:grpc/grpc.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

// -----------------
// LabelTransactionClient
// -----------------
class LabelTransactionClient {
  final TransactionServiceClient _client;

  LabelTransactionClient(ClientChannel channel)
      : _client = TransactionServiceClient(channel);

  Future<LabelTransactionResponse> labelTransaction(
    LabelTransactionRequest request,
  ) {
    return _client.labelTransaction(request);
  }
}

// -----------------
// TransactionStreamSubClient
// -----------------
class TransactionStreamSubClient {
  final TransactionStreamClient _client;

  TransactionStreamSubClient(ClientChannel channel)
      : _client = TransactionStreamClient(channel);

  ResponseStream<RpcTransactionUpdate> subTransactions() {
    return _client.subTransactions(Empty());
  }
}

// -----------------
// Consolidated TransactionClient
// -----------------
class TransactionClient {
  final LabelTransactionClient labelTransactionClient;
  final TransactionStreamSubClient transactionStreamSubClient;

  TransactionClient(ClientChannel channel)
      : labelTransactionClient = LabelTransactionClient(channel),
        transactionStreamSubClient = TransactionStreamSubClient(channel);

  Future<LabelTransactionResponse> labelTransaction(
    LabelTransactionRequest request,
  ) {
    return labelTransactionClient.labelTransaction(request);
  }

  ResponseStream<RpcTransactionUpdate> subTransactions() {
    return transactionStreamSubClient.subTransactions();
  }
}
