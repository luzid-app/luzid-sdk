// -----------------
// RpcGetAccountInfoClient
// -----------------
import 'package:grpc/grpc.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

class RpcGetAccountInfoClient {
  final RpcGetAccountInfoServiceClient _client;

  RpcGetAccountInfoClient(ClientChannel channel)
      : _client = RpcGetAccountInfoServiceClient(channel);

  Future<RpcGetAccountInfoResponse> getAccountInfo(
    RpcGetAccountInfoRequest request,
  ) {
    return _client.getAccountInfo(request);
  }
}

// -----------------
// RpcRequestAirdropClient
// -----------------
class RpcRequestAirdropClient {
  final RpcRequestAirdropServiceClient _client;

  RpcRequestAirdropClient(ClientChannel channel)
      : _client = RpcRequestAirdropServiceClient(channel);

  Future<RpcRequestAirdropResponse> requestAirdrop(
    RpcRequestAirdropRequest request,
  ) {
    return _client.requestAirdrop(request);
  }
}

// -----------------
// Consolidated RpcClient
// -----------------
class RpcClient {
  final RpcGetAccountInfoClient getAccountInfoClient;
  final RpcRequestAirdropClient requestAirdropClient;

  RpcClient(ClientChannel channel)
      : getAccountInfoClient = RpcGetAccountInfoClient(channel),
        requestAirdropClient = RpcRequestAirdropClient(channel);

  Future<RpcGetAccountInfoResponse> getAccountInfo(
    RpcGetAccountInfoRequest request,
  ) {
    return getAccountInfoClient.getAccountInfo(request);
  }

  Future<RpcRequestAirdropResponse> requestAirdrop(
    RpcRequestAirdropRequest request,
  ) {
    return requestAirdropClient.requestAirdrop(request);
  }
}
