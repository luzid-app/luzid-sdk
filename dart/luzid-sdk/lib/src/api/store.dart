import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/core/utils.dart';

class LuzidStore {
  final LuzidGrpcClient client;

  LuzidStore(this.client);

  /// Returns the data for an account.
  ///
  /// - [pubkey] - The pubkey of the account we are intrested in
  /// - [commitment] - the commitment that the for which the account
  /// data is returned, default is `confirmed`
  Future<StoreGetAccountDataResponse> getAccountData(
    String pubkey, {
    RpcCommitment commitment = RpcCommitment.Confirmed,
  }) async {
    final req = StoreGetAccountDataRequest(
      pubkey: pubkey,
      commitment: commitment,
    );
    final res = await client.store.getAccountData(req);
    return unwrap(res, 'Luzid store.getAccountData');
  }

  /// Returns the update to an account resulting from a specific transaction.
  ///
  /// - [pubkey] - The pubkey of the account we are intrested in
  /// - [transactionSignature] - The transaction that caused the account update
  Future<StoreGetDiffedAccountUpdateResponse> getDiffedAccountUpdate(
    String pubkey,
    String transactionSignature,
  ) async {
    final req = StoreGetDiffedAccountUpdateRequest(
      pubkey: pubkey,
      transactionSignature: transactionSignature,
    );
    final res = await client.store.getDiffedAccountUpdate(req);
    return unwrap(res, 'Luzid store.getDiffedAccountUpdate');
  }
}
