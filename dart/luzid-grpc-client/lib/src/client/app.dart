// -----------------
// AppOpsClient
// -----------------
import 'package:grpc/grpc.dart';
import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

class AppOpsClient {
  final AppOpsServiceClient _client;

  AppOpsClient(ClientChannel channel) : _client = AppOpsServiceClient(channel);

  Future<AppOpsResponse> appOps(AppOpsRequest request) {
    return _client.appOps(request);
  }
}

// -----------------
// Consolidated AppClient
// -----------------
class AppClient {
  final AppOpsClient _appOpsClient;

  AppClient(ClientChannel? channel)
      : _appOpsClient = AppOpsClient(channel ?? defaultLuzidChannel);

  Future<AppOpsResponse> appOps(AppOpsRequest request) {
    return _appOpsClient.appOps(request);
  }
}
