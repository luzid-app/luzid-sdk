import 'package:luzid_grpc/luzid_grpc.dart' as grpc;
import 'package:equatable/equatable.dart';

class ValidatorStatus extends Equatable {
  final bool up;
  final int starts;

  const ValidatorStatus({
    required this.up,
    required this.starts,
  });

  factory ValidatorStatus.from(grpc.ValidatorStatus status) {
    return ValidatorStatus(
      up: status.up,
      starts: status.starts,
    );
  }

  @override
  String toString() {
    return '''
  ValidatorStatus {
    up: $up,
    starts: $starts
  }''';
  }

  @override
  List<Object?> get props => [
        up,
        starts,
      ];
}
