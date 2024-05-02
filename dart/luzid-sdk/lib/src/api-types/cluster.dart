import 'package:luzid_grpc/luzid_grpc.dart' as grpc;

final solanaEndpoints = [
  'http://127.0.0.1:8899',
  'https://api.testnet.solana.com',
  'https://api.mainnet-beta.solana.com',
  'https://api.devnet.solana.com'
];

class LuzidCluster {
  /// The underlying grpc cluster used by Luzid only visible to the Luzid SDK
  final grpc.Cluster _grpcCluster;

  LuzidCluster._(this._grpcCluster);

  /// Local/development cluster
  static LuzidCluster development = LuzidCluster._(grpc.Cluster.Development);

  /// Solana testnet cluster
  static LuzidCluster testnet = LuzidCluster._(grpc.Cluster.Testnet);

  /// Solana mainnet cluster
  static LuzidCluster mainnetBeta = LuzidCluster._(grpc.Cluster.MainnetBeta);

  /// Solana devnet cluster
  static LuzidCluster devnet = LuzidCluster._(grpc.Cluster.Devnet);

  /// Gets the URL for the specific Solana cluster.
  String get apiUrl {
    switch (_grpcCluster) {
      case grpc.Cluster.Development:
        return solanaEndpoints[0];
      case grpc.Cluster.Testnet:
        return solanaEndpoints[1];
      case grpc.Cluster.MainnetBeta:
        return solanaEndpoints[2];
      case grpc.Cluster.Devnet:
        return solanaEndpoints[3];
      default:
        throw Exception('Unknown cluster: $_grpcCluster');
    }
  }

  String get label {
    switch (_grpcCluster) {
      case grpc.Cluster.Development:
        return 'Development';
      case grpc.Cluster.Testnet:
        return 'Testnet';
      case grpc.Cluster.MainnetBeta:
        return 'MainnetBeta';
      case grpc.Cluster.Devnet:
        return 'Devnet';
      default:
        throw Exception('Unknown cluster: $_grpcCluster');
    }
  }

  grpc.Cluster intoGrpcCluster() {
    return _grpcCluster;
  }

  factory LuzidCluster.fromGrpc(grpc.Cluster cluster) {
    return LuzidCluster._(cluster);
  }

  @override
  int get hashCode => label.hashCode;

  @override
  bool operator ==(Object other) =>
      other is LuzidCluster &&
      other.runtimeType == runtimeType &&
      other.label == label;
}
