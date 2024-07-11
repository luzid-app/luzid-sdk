export function assert(expr: boolean, message?: string): asserts expr {
  if (!expr) {
    throw new Error(message ?? 'unknown assertion error')
  }
}

// -----------------
// Types
// -----------------
export { RpcAccount } from './proto/types/account'
export { RpcContext } from './proto/types/rpc_context'

export { Cluster, clusterFromJSON, clusterToJSON } from './proto/types/cluster'

export {
  DataSource,
  dataSourceFromJSON,
  dataSourceToJSON,
} from './proto/types/data_source'

export { RpcDiffedAccountUpdate } from './proto/types/diffed_account_update'
export {
  RpcAccountModification,
  RpcModifyAccountOpts,
} from './proto/types/account_modification'

export { RpcSnapshotAccount } from './proto/types/snapshot_account'
export { RpcSnapshotFilter as SnapshotFilter } from './proto/types/snapshot_filter'

import { RpcCommitment } from './proto/types/commitment'

// -----------------
// Commitment
// -----------------
const COMMITMENTS = ['processed', 'confirmed', 'finalized'] as const
export type Commitment = (typeof COMMITMENTS)[number]

export function isValidCommitment(
  commitment: string
): commitment is Commitment {
  return COMMITMENTS.includes(commitment as Commitment)
}

export function rpcCommitmentFromCommitment(
  commitment?: Commitment | undefined
): RpcCommitment | undefined {
  if (commitment == null) return undefined

  assert(isValidCommitment(commitment), `invalid commitment: ${commitment}`)
  switch (commitment) {
    case 'processed':
      return RpcCommitment.Processed
    case 'confirmed':
      return RpcCommitment.Confirmed
    case 'finalized':
      return RpcCommitment.Finalized
    default:
      return RpcCommitment.UNRECOGNIZED
  }
}

// -----------------
// Requests
// -----------------
export {
  AppOperation,
  appOperationFromJSON,
  appOperationToJSON,
  AppOpsRequest,
  AppOpsResponse,
  AppOpsServiceDefinition,
  AppOpsServiceImplementation,
  AppOpsServiceClient,
} from './proto/requests/app_ops'

export {
  MutatorCloneAccountRequest,
  MutatorCloneAccountResponse,
  MutatorCloneAccountServiceDefinition,
  MutatorCloneAccountServiceImplementation,
  MutatorCloneAccountServiceClient,
} from './proto/requests/mutator_clone_account'

export {
  MutatorModifyAccountRequest,
  MutatorModifyAccountResponse,
  MutatorModifyAccountServiceDefinition,
  MutatorModifyAccountServiceImplementation,
  MutatorModifyAccountServiceClient,
} from './proto/requests/mutator_modify_account'

export {
  PingRequest,
  PingResponse,
  PingServiceDefinition,
  PingServiceImplementation,
  PingServiceClient,
} from './proto/requests/ping'

export {
  RpcGetAccountInfoRequest,
  RpcGetAccountInfoResponse,
  RpcGetAccountInfoServiceDefinition,
  RpcGetAccountInfoServiceImplementation,
  RpcGetAccountInfoServiceClient,
} from './proto/requests/rpc_get_account_info'

export {
  RpcRequestAirdropRequest,
  RpcRequestAirdropResponse,
  RpcRequestAirdropServiceDefinition,
  RpcRequestAirdropServiceImplementation,
  RpcRequestAirdropServiceClient,
} from './proto/requests/rpc_request_airdrop'

export {
  SnapshotGetAccountRequest,
  SnapshotGetAccountResponse,
  SnapshotGetAccountServiceDefinition,
  SnapshotGetAccountServiceImplementation,
  SnapshotGetAccountServiceClient,
} from './proto/requests/snapshot_get_account'

export {
  SnapshotCreateSnapshotRequest,
  SnapshotCreateSnapshotResponse,
  RpcSnapshotableAccount as SnapshotSnapshotableAccount,
  RpcCreateSnapshotResult as SnapshotCreateSnapshotResult,
  SnapshotDeleteSnapshotRequest,
  SnapshotDeleteSnapshotResponse,
  RpcDeleteSnapshotResult as SnapshotDeleteSnapshotResult,
  SnapshotDeleteSnapshotsMatchingRequest,
  SnapshotDeleteSnapshotsMatchingResponse,
  SnapshotDeleteSnapshotsMatchingResult,
  SnapshotGetSnaphotableAccountsRequest,
  SnapshotGetSnaphotableAccountsResponse,
  SnapshotManagementServiceDefinition,
  SnapshotManagementServiceImplementation,
  SnapshotManagementServiceClient,
} from './proto/requests/snapshot_management'

export {
  SnapshotListSnapshotsRequest,
  SnapshotListSnapshotsResponse,
  RpcSnapshotMetadata as SnapshotMetadata,
  RpcSnapshotAccountSummary as SnapshotAccountSummary,
  SnapshotRetrieveAccountsInSnapshotRequest,
  SnapshotRetrieveAccountsInSnapshotResponse,
  SnapshotRestoreAccountsFromLastUpdatedSnapshotRequest,
  SnapshotRestoreAccountsFromLastUpdatedSnapshotResponse,
  SnapshotRestoreAccountsFromSnapshotRequest,
  SnapshotRestoreAccountsFromSnapshotResponse,
  RpcSnapshotRestoreResult as SnapshotRestoreResult,
  SnapshotRestoreServiceDefinition,
  SnapshotRestoreServiceImplementation,
  SnapshotRestoreServiceClient,
} from './proto/requests/snapshot_restore'

export {
  StoreGetAccountDataRequest,
  StoreGetAccountDataResponse,
  RpcStoreAccountData,
  StoreGetAccountDataServiceDefinition,
  StoreGetAccountDataServiceImplementation,
  StoreGetAccountDataServiceClient,
} from './proto/requests/store_get_account_data'

export {
  StoreGetDiffedAccountUpdateRequest,
  StoreGetDiffedAccountUpdateResponse,
  StoreGetDiffedAccountUpdateServiceDefinition,
  StoreGetDiffedAccountUpdateServiceImplementation,
  StoreGetDiffedAccountUpdateServiceClient,
} from './proto/requests/store_get_diffed_account_update'

export {
  ValidatorOperation,
  validatorOperationFromJSON,
  validatorOperationToJSON,
  ValidatorOpsRequest,
  ValidatorOpsResponse,
  ValidatorOpsServiceDefinition,
  ValidatorOpsServiceImplementation,
  ValidatorOpsServiceClient,
} from './proto/requests/validator_ops'

export {
  LabelTransactionRequest,
  LabelTransactionResponse,
  TransactionServiceDefinition,
  TransactionServiceImplementation,
  TransactionServiceClient,
} from './proto/requests/transaction'

export {
  GetWorkspaceRequest,
  GetWorkspaceResponse,
  CloneWorkspaceRequest,
  CloneWorkspaceResponse,
  WatchWorkspaceRequest,
  WatchWorkspaceResponse,
  UnwatchWorkspaceRequest,
  UnwatchWorkspaceResponse,
  AddWorkspaceRequest,
  AddWorkspaceResponse,
  RemoveWorkspaceRequest,
  RemoveWorkspaceResponse,
  ListWorkspacesResponse,
  RpcWorkspaceProgram as WorkspaceProgram,
  RpcWorkspace as Workspace,
  RpcClonableWorkspaceProgram as ClonableWorkspaceProgram,
  RpcClonableWorkspace as ClonableWorkspace,
  WorkspaceServiceClient,
  WorkspaceServiceDefinition,
} from './proto/requests/workspace'
