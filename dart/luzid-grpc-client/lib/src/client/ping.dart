import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

class PingClient {
  final PingServiceClient _client;

  PingClient(ClientChannelBase channel) : _client = PingServiceClient(channel);

  Future<PingResponse> ping() {
    return _client.ping(PingRequest());
  }
}
