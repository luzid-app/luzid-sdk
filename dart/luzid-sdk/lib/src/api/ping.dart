import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';

export 'package:luzid_grpc/luzid_grpc.dart' show AppOperation;

class LuzidPing {
  final PingClient _client;

  LuzidPing(LuzidGrpcClient client) : _client = client.ping;

  /// Performs a ping request to ensure the Luzid service is running.
  Future<PingResponse> ping() async {
    return _client.ping();
  }
}
