import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

class ReleaseInfoClient {
  final ReleaseInfoServiceClient _client;

  ReleaseInfoClient(ClientChannelBase channel)
      : _client = ReleaseInfoServiceClient(channel);

  Future<ReleaseInfoResponse> getReleaseInfo() {
    return _client.getReleaseInfo(Empty());
  }
}
