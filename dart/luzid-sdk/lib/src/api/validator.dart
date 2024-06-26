import 'package:luzid_grpc/luzid_grpc.dart'
    hide ValidatorStatus, ValidatorInfo, ValidatorStats;
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/api-types/validator_info.dart';
import 'package:luzid_sdk/src/api-types/validator_stats.dart';
import 'package:luzid_sdk/src/api-types/validator_status.dart';
import 'package:luzid_sdk/src/core/utils.dart';

export 'package:luzid_sdk/src/api-types/validator_info.dart';
export 'package:luzid_sdk/src/api-types/validator_stats.dart';
export 'package:luzid_sdk/src/api-types/validator_status.dart';

class LuzidValidator {
  final ValidatorClient _client;

  LuzidValidator(LuzidGrpcClient client) : _client = client.validator;

  /// Performs an operation on the validator.
  Future<ValidatorOpsResponse> _validatorOps(ValidatorOperation op) async {
    final res = await _client.validatorOps(ValidatorOpsRequest(op: op));
    return unwrap(res, 'Luzid validator.validatorOps');
  }

  /// Starts the validator.
  Future<ValidatorOpsResponse> start() {
    return _validatorOps(ValidatorOperation.Start);
  }

  /// Stops the validator.
  Future<ValidatorOpsResponse> stop() {
    return _validatorOps(ValidatorOperation.Stop);
  }

  /// Restarts the validator.
  Future<ValidatorOpsResponse> restart() {
    return _validatorOps(ValidatorOperation.Restart);
  }

  Stream<ValidatorStatus> subValidatorStatus({bool emitCurrent = false}) {
    return _client.subValidatorStatus(emitCurrent).map((rpc) {
      return ValidatorStatus.from(rpc);
    });
  }

  Stream<ValidatorInfo> subValidatorInfo({bool emitCurrent = false}) {
    return _client.subValidatorInfo(emitCurrent).map((rpc) {
      return ValidatorInfo.from(rpc);
    });
  }

  Stream<ValidatorStats> subValidatorStats() {
    return _client.subValidatorStats().map((rpc) {
      return ValidatorStats.from(rpc);
    });
  }
}
