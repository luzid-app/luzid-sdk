import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

// -----------------
// RpcGetAccountInfoClient
// -----------------
class RpcGetAccountInfoClient {
  final RpcGetAccountInfoServiceClient _client;

  RpcGetAccountInfoClient(ClientChannelBase channel)
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

  RpcRequestAirdropClient(ClientChannelBase channel)
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

  RpcClient(ClientChannelBase channel)
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
