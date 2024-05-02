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

  Future<ValidatorOpsResponse> validatorOps(ValidatorOpsRequest request) {
    return _client.validatorOps(request);
  }
}

// -----------------
// ValidatorStatusClient
// -----------------
class _ValidatorStatusSubClient {
  final ValidatorStatusSubClient _client;

  _ValidatorStatusSubClient(ClientChannel channel)
      : _client = ValidatorStatusSubClient(channel);

  ResponseStream<ValidatorStatus> subValidatorStatus() {
    return _client.subValidatorStatus(Empty());
  }
}

// -----------------
// Consolidated ValidatorClient
// -----------------
class ValidatorClient {
  final ValidatorOpsClient _validatorOpsClient;
  final _ValidatorStatusSubClient _validatorStatusSubClient;

  ValidatorClient(ClientChannel? channel)
      : _validatorOpsClient =
            ValidatorOpsClient(channel ?? defaultLuzidChannel),
        _validatorStatusSubClient =
            _ValidatorStatusSubClient(channel ?? defaultLuzidChannel);

  Future<ValidatorOpsResponse> validatorOps(ValidatorOpsRequest request) {
    return _validatorOpsClient.validatorOps(request);
  }

  ResponseStream<ValidatorStatus> subValidatorStatus() {
    return _validatorStatusSubClient.subValidatorStatus();
  }
}
