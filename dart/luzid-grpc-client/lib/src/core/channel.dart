import 'package:grpc/grpc.dart';
import 'package:grpc/grpc_connection_interface.dart';

final defaultLuzidChannel =
    createLuzidGrpcChannel(host: 'localhost', port: 50051);

ClientChannelBase createLuzidGrpcChannel(
    {required String host, required int port}) {
  return ClientChannel(host,
      port: port,
      options: ChannelOptions(credentials: ChannelCredentials.insecure()));
}
