import 'package:fixnum/fixnum.dart';
import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/api-types/transaction_labeled.dart';
import 'package:luzid_sdk/src/api-types/transaction_update.dart';
import 'package:luzid_sdk/src/core/utils.dart';

export 'package:luzid_sdk/src/api-types/transaction_account.dart';
export 'package:luzid_sdk/src/api-types/transaction_update.dart';
export 'package:luzid_sdk/src/api-types/transaction_labeled.dart';

class LuzidTransaction {
  final LuzidGrpcClient _client;

  LuzidTransaction(this._client);

  /// Labels a transaction to help identifying it inside the Luzid UI.
  ///
  /// NOTE: that this is a Luzid only feature and does not affect how explorers display
  /// the transaction.
  Future<LabelTransactionResponse> labelTransaction(
      String signature, String label) async {
    final req = LabelTransactionRequest(signature: signature, label: label);
    final res = await _client.transaction.labelTransaction(req);
    return unwrap(res, 'Luzid transaction.label');
  }

  /// Fetches recent transaction updates.
  ///
  /// This is useful to fetch transactions that have been processed
  /// by the network, i.e. when the Luzid UI attaches late but wants to show
  /// all transactions.
  /// * [limit] - The maximum number of transactions to fetch, optional, by default all are fetched
  Future<Iterable<TransactionUpdate>> recentTransactionUpdates(
      {int? limit}) async {
    final req = RecentTransactionUpdatesRequest(
        limit: limit != null ? Int64(limit) : null);
    final res = await _client.transaction.recentTransactionUpdates(req);
    return unwrap(res, 'Luzid recentTransactionUpdates').updates.map((rpc) {
      return TransactionUpdate.from(rpc);
    });
  }

  Stream<TransactionUpdate> subTransactions() {
    return _client.transaction.subTransactions().map((rpc) {
      return TransactionUpdate.from(rpc);
    });
  }

  /// Subscribes to updates emitted when any transaction is labeled.
  Stream<TransactionLabeled> subTransactionLabeled() {
    return _client.transaction.subTransactionModifiedLabeled().map((rpc) {
      return TransactionLabeled.from(rpc);
    });
  }
}
