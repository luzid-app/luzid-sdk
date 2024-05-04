import 'package:grpc/grpc_connection_interface.dart';
import 'package:grpc/grpc_web.dart';

ClientChannelBase createLuzidGrpcWebChannel(
    {required String host, required int port}) {
  return GrpcWebClientChannel.xhr(Uri.parse('http://$host:$port'));
}
