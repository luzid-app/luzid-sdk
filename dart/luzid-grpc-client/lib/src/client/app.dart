import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

// -----------------
// AppOpsClient
// -----------------
class AppOpsClient {
  final AppOpsServiceClient _client;

  AppOpsClient(ClientChannelBase channel)
      : _client = AppOpsServiceClient(channel);

  Future<AppOpsResponse> appOps(AppOpsRequest request) {
    return _client.appOps(request);
  }
}

// -----------------
// Consolidated AppClient
// -----------------
class AppClient {
  final AppOpsClient _appOpsClient;

  AppClient(ClientChannelBase? channel)
      : _appOpsClient = AppOpsClient(channel ?? defaultLuzidChannel);

  Future<AppOpsResponse> appOps(AppOpsRequest request) {
    return _appOpsClient.appOps(request);
  }
}
