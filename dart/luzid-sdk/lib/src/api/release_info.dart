import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/core/utils.dart';

export 'package:luzid_grpc/luzid_grpc.dart' show ReleaseInfo;

class LuzidReleaseInfo {
  final ReleaseInfoClient _client;

  LuzidReleaseInfo(LuzidGrpcClient client) : _client = client.releaseInfo;

  /// Performs a request to get the latest Luzid release info as well as
  /// the version of this instance.
  Future<ReleaseInfo> getReleaseInfo() async {
    final res = await _client.getReleaseInfo();
    return unwrap(res, 'Luzid meta.getReleaseInfo').info;
  }
}
