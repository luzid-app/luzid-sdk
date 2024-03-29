import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/core/utils.dart';

class LuzidApp {
  final AppClient _client;

  LuzidApp(LuzidGrpcClient client) : _client = client.app;

  /// Performs a Luzid app operation specified via [op].
  Future<AppOpsResponse> appOps(AppOperation op) async {
    final res = await _client.appOps(AppOpsRequest(op: op));
    return unwrap(res, 'Luzid app.appOps');
  }
}
