import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/core/utils.dart';

export 'package:luzid_grpc/luzid_grpc.dart' show Meta;

class LuzidMeta {
  final MetaClient _client;

  LuzidMeta(LuzidGrpcClient client) : _client = client.meta;

  /// Performs a meta request to get information about the Luzid instance.
  Future<Meta> getMeta() async {
    final res = await _client.getMeta();
    return unwrap(res, 'Luzid meta.getMeta').meta;
  }
}
