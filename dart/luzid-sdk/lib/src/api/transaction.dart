import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/api-types/transaction_update.dart';
import 'package:luzid_sdk/src/core/utils.dart';

export 'package:luzid_sdk/src/api-types/transaction_account.dart';
export 'package:luzid_sdk/src/api-types/transaction_update.dart';

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

  Stream<TransactionUpdate> subTransactions() {
    return _client.transaction.subTransactions().map((rpc) {
      return TransactionUpdate.from(rpc);
    });
  }
}
