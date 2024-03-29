import 'package:grpc/grpc.dart';
import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

// -----------------
// ValidatorOpsClient
// -----------------
class ValidatorOpsClient {
  final ValidatorOpsServiceClient _client;

  ValidatorOpsClient(ClientChannel channel)
      : _client = ValidatorOpsServiceClient(channel);

  Future<ReadResponse> validatorOps(ReadRequest request) {
    return _client.validatorOps(request);
  }
}

// -----------------
// Consolidated ValidatorClient
// -----------------
class ValidatorClient {
  final ValidatorOpsClient _validatorOpsClient;

  ValidatorClient(ClientChannel? channel)
      : _validatorOpsClient =
            ValidatorOpsClient(channel ?? defaultLuzidChannel);

  Future<ReadResponse> validatorOps(ReadRequest request) {
    return _validatorOpsClient.validatorOps(request);
  }
}
