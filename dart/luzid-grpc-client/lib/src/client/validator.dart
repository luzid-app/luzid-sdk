import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

// -----------------
// ValidatorOpsClient
// -----------------
class ValidatorOpsClient {
  final ValidatorOpsServiceClient _client;

  ValidatorOpsClient(ClientChannelBase channel)
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

  _ValidatorStatusSubClient(ClientChannelBase channel)
      : _client = ValidatorStatusSubClient(channel);

  ResponseStream<ValidatorStatus> subValidatorStatus() {
    return _client.subValidatorStatus(Empty());
  }
}

// -----------------
// ValidatorInfoClient
// -----------------
class _ValidatorInfoSubClient {
  final ValidatorInfoSubClient _client;

  _ValidatorInfoSubClient(ClientChannelBase channel)
      : _client = ValidatorInfoSubClient(channel);

  ResponseStream<ValidatorInfo> subValidatorInfo() {
    return _client.subValidatorInfo(Empty());
  }
}

// -----------------
// ValidatorStatsClient
// -----------------
class _ValidatorStatsSubClient {
  final ValidatorStatsSubClient _client;

  _ValidatorStatsSubClient(ClientChannelBase channel)
      : _client = ValidatorStatsSubClient(channel);

  ResponseStream<ValidatorStats> subValidatorStats() {
    return _client.subValidatorStats(Empty());
  }
}

// -----------------
// Consolidated ValidatorClient
// -----------------
class ValidatorClient {
  final ValidatorOpsClient _validatorOpsClient;
  final _ValidatorStatusSubClient _validatorStatusSubClient;
  final _ValidatorInfoSubClient _validatorInfoSubClient;
  final _ValidatorStatsSubClient _validatorStatsSubClient;

  ValidatorClient(ClientChannelBase? channel)
      : _validatorOpsClient =
            ValidatorOpsClient(channel ?? defaultLuzidChannel),
        _validatorStatusSubClient =
            _ValidatorStatusSubClient(channel ?? defaultLuzidChannel),
        _validatorInfoSubClient =
            _ValidatorInfoSubClient(channel ?? defaultLuzidChannel),
        _validatorStatsSubClient =
            _ValidatorStatsSubClient(channel ?? defaultLuzidChannel);

  Future<ValidatorOpsResponse> validatorOps(ValidatorOpsRequest request) {
    return _validatorOpsClient.validatorOps(request);
  }

  ResponseStream<ValidatorStatus> subValidatorStatus() {
    return _validatorStatusSubClient.subValidatorStatus();
  }

  ResponseStream<ValidatorInfo> subValidatorInfo() {
    return _validatorInfoSubClient.subValidatorInfo();
  }

  ResponseStream<ValidatorStats> subValidatorStats() {
    return _validatorStatsSubClient.subValidatorStats();
  }
}
