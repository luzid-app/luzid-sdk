import 'package:grpc/grpc.dart';

final defaultLuzidChannel =
    createLuzidGrpcChannel(host: 'localhost', port: 50051);

createLuzidGrpcChannel({required String host, required int port}) {
  return ClientChannel(host,
      port: port,
      options: ChannelOptions(credentials: ChannelCredentials.insecure()));
}
