import 'package:grpc/grpc_connection_interface.dart';
import 'package:grpc/grpc_or_grpcweb.dart';

final defaultLuzidChannel =
    createLuzidGrpcChannel(host: 'localhost', port: 60061);

ClientChannelBase createLuzidGrpcChannel(
    {required String host, required int port, bool secure = false}) {
  return GrpcOrGrpcWebClientChannel.toSingleEndpoint(
    host: host,
    port: port,
    transportSecure: secure,
  );
}
