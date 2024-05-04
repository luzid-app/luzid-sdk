import 'package:luzid_grpc/luzid_grpc.dart' show GeneratedMessage;

T unwrap<T extends GeneratedMessage>(T resIn, String method) {
  final dynamic res = resIn;
  if (res.hasError()) {
    throw Exception('$method returned an error:\n${res.error}');
  }
  return resIn;
}
