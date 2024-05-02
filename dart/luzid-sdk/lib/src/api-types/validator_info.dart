import 'package:luzid_grpc/luzid_grpc.dart' as grpc;
import 'package:equatable/equatable.dart';

class ValidatorInfo extends Equatable {
  final String ledgerPath;
  final String pubkey;
  final int starts;
  final String gossip;
  final String tpu;
  final String tpuQuic;
  final String rpc;
  final String pubsub;
  final String version;
  final int featureSet;
  final int shredVersion;

  const ValidatorInfo({
    required this.ledgerPath,
    required this.pubkey,
    required this.starts,
    required this.gossip,
    required this.tpu,
    required this.tpuQuic,
    required this.rpc,
    required this.pubsub,
    required this.version,
    required this.featureSet,
    required this.shredVersion,
  });

  factory ValidatorInfo.from(grpc.ValidatorInfo info) {
    return ValidatorInfo(
      ledgerPath: info.ledgerPath,
      pubkey: info.pubkey,
      starts: info.starts,
      gossip: info.gossip,
      tpu: info.tpu,
      tpuQuic: info.tpuQuic,
      rpc: info.rpc,
      pubsub: info.pubsub,
      version: info.version,
      featureSet: info.featureSet,
      shredVersion: info.shredVersion,
    );
  }

  factory ValidatorInfo.empty() {
    return ValidatorInfo(
      ledgerPath: '',
      pubkey: '',
      starts: 0,
      gossip: '',
      tpu: '',
      tpuQuic: '',
      rpc: '',
      pubsub: '',
      version: '',
      featureSet: 0,
      shredVersion: 0,
    );
  }

  @override
  String toString() {
    return '''
  ValidatorInfo {
    ledgerPath: $ledgerPath,
    pubkey: $pubkey,
    starts: $starts,
    gossip: $gossip,
    tpu: $tpu,
    tpuQuic: $tpuQuic,
    rpc: $rpc,
    pubsub: $pubsub,
    version: $version,
    featureSet: $featureSet,
    shredVersion: $shredVersion
  }''';
  }

  @override
  List<Object?> get props => [
        ledgerPath,
        pubkey,
        starts,
        gossip,
        tpu,
        tpuQuic,
        rpc,
        pubsub,
        version,
        featureSet,
        shredVersion,
      ];
}
