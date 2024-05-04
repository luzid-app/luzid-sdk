import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/api-types/cluster.dart';

class LuzidRpc {
  final LuzidGrpcClient client;

  LuzidRpc(this.client);

  /// Returns the info for an account.
  ///
  /// - [cluster] - the cluster to query
  /// - [address] - the pubkey of the account
  ///
  /// The returned account has the following properties:
  ///
  /// - **owner**: the owner of the account
  /// - **data**: the data of the account
  /// - **executable**: whether the account is executable
  /// - **lamports**: the balance of the account
  /// - **rentEpoch**: the rent epoch of the account
  Future<RpcGetAccountInfoResponse> getAccountInfo(
    LuzidCluster cluster,
    String address,
  ) async {
    final req = RpcGetAccountInfoRequest()
      ..cluster = cluster.intoGrpcCluster()
      ..address = address;
    final res = await client.rpc.getAccountInfo(req);
    return res;
  }

  /// Requests to drop SOL to an account.
  ///
  /// - [cluster] - the cluster to drop SOL to
  /// - [address] - the pubkey of the account to fund
  /// - [solAmount] - the amount of SOL to drop
  Future<RpcRequestAirdropResponse> requestAirdrop(
    LuzidCluster cluster,
    String address,
    int solAmount,
  ) async {
    final grpcCluster = cluster.intoGrpcCluster();
    assert(
      grpcCluster == Cluster.Development,
      'Invalid cluster $cluster. Luzid can only airdrop to the Development cluster.',
    );
    final req = RpcRequestAirdropRequest()
      ..cluster = grpcCluster
      ..address = address
      ..solAmount = solAmount;
    final res = await client.rpc.requestAirdrop(req);
    return res;
  }
}
