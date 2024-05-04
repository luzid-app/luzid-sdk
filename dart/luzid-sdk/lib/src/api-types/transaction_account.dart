import 'package:equatable/equatable.dart';
import 'package:fixnum/fixnum.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

class TransactionAccount extends Equatable {
  final String pubkey;
  final bool isSigner;
  final bool isWritable;
  final bool isFeePayer;
  final Int64 preBalance;
  final Int64 postBalance;
  final int transactionIdx;

  const TransactionAccount(
    this.pubkey,
    this.isSigner,
    this.isWritable,
    this.isFeePayer,
    this.preBalance,
    this.postBalance,
    this.transactionIdx,
  );

  factory TransactionAccount.fromRpcTransactionAccount(
      RpcTransactionAccount rpc) {
    return TransactionAccount(
      rpc.pubkey,
      rpc.isSigner,
      rpc.isWritable,
      rpc.isFeePayer,
      rpc.preBalance,
      rpc.postBalance,
      rpc.transactionIdx,
    );
  }

  @override
  String toString() {
    return '''
      TransactionAccount {
        pubkey: $pubkey,
        isSigner: $isSigner,
        isWritable: $isWritable,
        isFeePayer: $isFeePayer,
        preBalance: $preBalance,
        postBalance: $postBalance
        transactionIdx: $transactionIdx
      }''';
  }

  @override
  List<Object?> get props => [
        pubkey,
        isSigner,
        isWritable,
        isFeePayer,
        preBalance,
        postBalance,
        transactionIdx,
      ];
}
