import 'package:luzid_grpc/luzid_grpc.dart' as grpc;
import 'package:equatable/equatable.dart';

class ValidatorStats extends Equatable {
  final int finalizedSlot;
  final int confirmedSlot;
  final int processedSlot;
  final int transactionCount;
  final int identityBalance;
  final ValidatorHealth health;

  const ValidatorStats({
    required this.finalizedSlot,
    required this.confirmedSlot,
    required this.processedSlot,
    required this.transactionCount,
    required this.identityBalance,
    required this.health,
  });

  factory ValidatorStats.from(grpc.ValidatorStats stats) {
    return ValidatorStats(
      finalizedSlot: stats.finalizedSlot.toInt(),
      confirmedSlot: stats.confirmedSlot.toInt(),
      processedSlot: stats.processedSlot.toInt(),
      transactionCount: stats.transactionCount.toInt(),
      identityBalance: stats.identityBalance.toInt(),
      health: _ValidatorHealthX.from(stats.health),
    );
  }

  factory ValidatorStats.empty() {
    return ValidatorStats(
      finalizedSlot: 0,
      confirmedSlot: 0,
      processedSlot: 0,
      transactionCount: 0,
      identityBalance: 0,
      health: ValidatorHealth.unknown,
    );
  }

  @override
  String toString() {
    return '''
  ValidatorStats {
    finalizedSlot: $finalizedSlot,
    confirmedSlot: $confirmedSlot,
    processedSlot: $processedSlot,
    transactionCount: $transactionCount,
    identityBalance: $identityBalance,
    health: $health
  }''';
  }

  @override
  List<Object?> get props => [
        finalizedSlot,
        confirmedSlot,
        processedSlot,
        transactionCount,
        identityBalance,
        health,
      ];
}

enum ValidatorHealth {
  ok,
  unhealthy,
  unknown,
}

extension _ValidatorHealthX on ValidatorHealth {
  static ValidatorHealth from(grpc.ValidatorHealth health) {
    switch (health) {
      case grpc.ValidatorHealth.Ok:
        return ValidatorHealth.ok;
      case grpc.ValidatorHealth.Unhealthy:
        return ValidatorHealth.unhealthy;
      case grpc.ValidatorHealth.Unknown:
        return ValidatorHealth.unknown;
      default:
        throw ArgumentError('Unknown validator health: $health');
    }
  }
}
