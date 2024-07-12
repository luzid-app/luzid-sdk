import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

// -----------------
// LabelTransactionClient
// -----------------
class LabelTransactionClient {
  final TransactionServiceClient _client;

  LabelTransactionClient(ClientChannelBase channel)
      : _client = TransactionServiceClient(channel);

  Future<LabelTransactionResponse> labelTransaction(
    LabelTransactionRequest request,
  ) {
    return _client.labelTransaction(request);
  }
}

// -----------------
// RecentTransactionUpdatesClient
// -----------------
class _RecentTransactionUpdatesClient {
  final TransactionUpdatesServiceClient _client;

  _RecentTransactionUpdatesClient(ClientChannelBase channel)
      : _client = TransactionUpdatesServiceClient(channel);

  Future<RecentTransactionUpdatesResponse> recentTransactionUpdates(
    RecentTransactionUpdatesRequest request,
  ) {
    return _client.recentTransactionUpdates(request);
  }
}

// -----------------
// TransactionSubClient
// -----------------
class _TransactionStreamSubClient {
  final TransactionSubClient _client;

  _TransactionStreamSubClient(ClientChannelBase channel)
      : _client = TransactionSubClient(channel);

  ResponseStream<RpcTransactionUpdate> subTransactions() {
    return _client.subTransactions(Empty());
  }
}

// -----------------
// TransactionModifiedSubClient
// -----------------
class _TransactionModifiedSubClient {
  final TransactionModifiedSubClient _client;

  _TransactionModifiedSubClient(ClientChannelBase channel)
      : _client = TransactionModifiedSubClient(channel);

  ResponseStream<TransactionModificationLabeled>
      subTransactionModifiedLabeled() {
    return _client.subTransactionLabeled(Empty());
  }
}

// -----------------
// Consolidated TransactionClient
// -----------------
class TransactionClient {
  final LabelTransactionClient labelTransactionClient;
  final _TransactionStreamSubClient _transactionSubClient;
  final _TransactionModifiedSubClient _transactionModifiedSubClient;
  final _RecentTransactionUpdatesClient _recentTransactionUpdatesClient;

  TransactionClient(ClientChannelBase channel)
      : labelTransactionClient = LabelTransactionClient(channel),
        _recentTransactionUpdatesClient =
            _RecentTransactionUpdatesClient(channel),
        _transactionSubClient = _TransactionStreamSubClient(channel),
        _transactionModifiedSubClient = _TransactionModifiedSubClient(channel);

  Future<LabelTransactionResponse> labelTransaction(
    LabelTransactionRequest request,
  ) {
    return labelTransactionClient.labelTransaction(request);
  }

  Future<RecentTransactionUpdatesResponse> recentTransactionUpdates(
    RecentTransactionUpdatesRequest request,
  ) {
    return _recentTransactionUpdatesClient.recentTransactionUpdates(request);
  }

  ResponseStream<RpcTransactionUpdate> subTransactions() {
    return _transactionSubClient.subTransactions();
  }

  ResponseStream<TransactionModificationLabeled>
      subTransactionModifiedLabeled() {
    return _transactionModifiedSubClient.subTransactionModifiedLabeled();
  }
}
