import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

class MetaClient {
  final MetaServiceClient _client;

  MetaClient(ClientChannelBase channel) : _client = MetaServiceClient(channel);

  Future<MetaResponse> getMeta() {
    return _client.getMeta(MetaRequest());
  }
}
