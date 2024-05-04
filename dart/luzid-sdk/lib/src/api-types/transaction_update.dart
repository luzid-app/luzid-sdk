import 'package:equatable/equatable.dart';
import 'package:fixnum/fixnum.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

import 'transaction_account.dart';

class TransactionUpdate extends Equatable {
  final Int64 slot;
  final String signature;
  final String label;
  final String error;
  final List<TransactionAccount> accounts;
  final String programId;
  final Int64 computeUnitsConsumed;
  final int numInstructions;
  final Int64 index;

  const TransactionUpdate({
    required this.slot,
    required this.signature,
    required this.label,
    required this.error,
    required this.accounts,
    required this.programId,
    required this.computeUnitsConsumed,
    required this.numInstructions,
    required this.index,
  });

  factory TransactionUpdate.from(RpcTransactionUpdate rpc) {
    return TransactionUpdate(
      slot: rpc.slot,
      signature: rpc.signature,
      label: rpc.label,
      error: rpc.error,
      accounts: rpc.accounts
          .map(TransactionAccount.fromRpcTransactionAccount)
          .toList(),
      programId: rpc.programId,
      computeUnitsConsumed: rpc.computeUnitsConsumed,
      numInstructions: rpc.numInstructions,
      index: rpc.index,
    );
  }

  @override
  String toString() {
    return '''
  TransactionUpdate {
    slot: $slot,
    signature: $signature,
    label: $label,
    error: $error,
    accounts: [\n${accounts.join(',\n')}],
    programId: $programId,
    computeUnitsConsumed: $computeUnitsConsumed,
    numInstructions: $numInstructions,
    index: $index
  }''';
  }

  @override
  List<Object?> get props => [
        slot,
        signature,
        label,
        error,
        accounts,
        programId,
        computeUnitsConsumed,
        numInstructions,
        index,
      ];
}
