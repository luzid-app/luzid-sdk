import { Cluster as GrpcCluster, clusterToJSON } from '@luzid/grpc'
import { assert } from '../core/assert'

const SOLANA_ENDPOINTS = [
  'http://127.0.0.1:8899',
  'https://api.testnet.solana.com',
  'https://api.mainnet-beta.solana.com',
  'https://api.devnet.solana.com',
] as const

export type SolanaEndpoint = (typeof SOLANA_ENDPOINTS)[number]

/**
 * A Solana cluster to be used with the Luzid SDK.
 * @see {@link Cluster}
 */
export type LuzidCluster = {
  apiUrl: SolanaEndpoint
  toJSON(): string
}

/**
 * Wrapper around the Cluster enum which provides a URL for each cluster including
 * the development cluster that Luzid is running.
 * This is similar to the @solana/web3.js Cluster except that the web3 version does
 * not include the development cluster.
 */
export class Cluster implements LuzidCluster {
  private constructor(
    /**
     * The underlying grpc cluster used by Luzid only visible to the Luzid SDK
     * itself.
     * @private
     */
    readonly grpcCluster: GrpcCluster
  ) {}

  /**
   * Local/development cluster, use this for transactions and queries against
   * the  locally running validator running inside the Luzid App.
   */
  static Development: LuzidCluster = new Cluster(GrpcCluster.Development)
  /** Solana testnet cluster */
  static Testnet: LuzidCluster = new Cluster(GrpcCluster.Testnet)
  /** Solana mainnet cluster */
  static MainnetBeta: LuzidCluster = new Cluster(GrpcCluster.MainnetBeta)
  /** Solana devnet cluster */
  static Devnet: LuzidCluster = new Cluster(GrpcCluster.Devnet)

  /**
   * Gets the URL for the specific Solana cluster.
   */
  get apiUrl(): SolanaEndpoint {
    switch (this.grpcCluster) {
      case GrpcCluster.Development:
        return 'http://127.0.0.1:8899'
      case GrpcCluster.Testnet:
        return 'https://api.testnet.solana.com'
      case GrpcCluster.MainnetBeta:
        return 'https://api.mainnet-beta.solana.com'
      case GrpcCluster.Devnet:
        return 'https://api.devnet.solana.com'
      default:
        throw new Error(`Unknown cluster: ${this.grpcCluster}`)
    }
  }

  toJSON() {
    return clusterToJSON(this.grpcCluster)
  }
}

/** @private */
export function isCluster(cluster: LuzidCluster): cluster is Cluster {
  return (cluster as Cluster).grpcCluster != null
}

/** @private */
export function asCluster(cluster: LuzidCluster): Cluster {
  assert(isCluster(cluster), 'Expected a Cluster')
  return cluster
}

export function intoGrpcCluster(cluster: LuzidCluster): GrpcCluster {
  return asCluster(cluster).grpcCluster
}
