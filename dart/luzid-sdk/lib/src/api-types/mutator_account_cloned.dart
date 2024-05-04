import 'package:equatable/equatable.dart';
import 'package:luzid_grpc/luzid_grpc.dart' as grpc;
import 'package:luzid_sdk/src/api-types/cluster.dart';

class MutatorAccountCloned extends Equatable {
  final LuzidCluster cluster;
  final String address;

  const MutatorAccountCloned({
    required this.cluster,
    required this.address,
  });

  factory MutatorAccountCloned.from(grpc.MutatorAccountCloned rpc) {
    return MutatorAccountCloned(
      cluster: LuzidCluster.fromGrpc(rpc.cluster),
      address: rpc.address,
    );
  }

  @override
  List<Object?> get props => [cluster, address];
}
