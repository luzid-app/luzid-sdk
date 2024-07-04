import 'package:equatable/equatable.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

class TransactionLabeled extends Equatable {
  final String signature;
  final String label;

  const TransactionLabeled({
    required this.signature,
    required this.label,
  });

  factory TransactionLabeled.from(TransactionModificationLabeled rpc) {
    return TransactionLabeled(
      signature: rpc.signature,
      label: rpc.label,
    );
  }

  @override
  List<Object> get props => [signature, label];

  @override
  String toString() {
    return '''
  TransactionLabeled {
    signature: $signature,
    label: $label
  }''';
  }
}
