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
// TransactionSubClient
// -----------------
class _TransactionStreamSubClient {
  final TransactionSubClient _client;

  _TransactionStreamSubClient(ClientChannel channel)
      : _client = TransactionSubClient(channel);

  ResponseStream<RpcTransactionUpdate> subTransactions() {
    return _client.subTransactions(Empty());
  }
}

// -----------------
// Consolidated TransactionClient
// -----------------
class TransactionClient {
  final LabelTransactionClient labelTransactionClient;
  final _TransactionStreamSubClient _transactionSubClient;

  TransactionClient(ClientChannel channel)
      : labelTransactionClient = LabelTransactionClient(channel),
        _transactionSubClient = _TransactionStreamSubClient(channel);

  Future<LabelTransactionResponse> labelTransaction(
    LabelTransactionRequest request,
  ) {
    return labelTransactionClient.labelTransaction(request);
  }

  ResponseStream<RpcTransactionUpdate> subTransactions() {
    return _transactionSubClient.subTransactions();
  }
}
