export function assert(expr: boolean, message?: string): asserts expr {
  if (!expr) {
    throw new Error(message ?? 'unknown assertion error')
  }
}

// -----------------
// Types
// -----------------
export { RpcAccount } from './proto/types/account'

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
  Operation as AppOpsOperation,
  operationFromJSON as appOpsOperationFromJSON,
  operationToJSON as appOpsOperationToJSON,
  ReadRequest as AppOpsRequest,
  ReadResponse as AppOpsResponse,
  AppOpsServiceDefinition,
  AppOpsServiceImplementation,
  AppOpsServiceClient,
} from './proto/requests/app_ops'

export {
  CreateRequest as MutatorCloneAccountRequest,
  CreateResponse as MutatorCloneAccountResponse,
  MutatorCloneAccountServiceDefinition,
  MutatorCloneAccountServiceImplementation,
  MutatorCloneAccountServiceClient,
} from './proto/requests/mutator_clone_account'

export {
  UpdateRequest as MutatorModifyAccountRequest,
  UpdateResponse as MutatorModifyAccountResponse,
  MutatorModifyAccountServiceDefinition,
  MutatorModifyAccountServiceImplementation,
  MutatorModifyAccountServiceClient,
} from './proto/requests/mutator_modify_account'

export {
  RpcContext,
  ReadRequest as RpcGetAccountInfoRequest,
  ReadResponse as RpcGetAccountInfoResponse,
  RpcGetAccountInfoServiceDefinition,
  RpcGetAccountInfoServiceImplementation,
  RpcGetAccountInfoServiceClient,
} from './proto/requests/rpc_get_account_info'

export {
  UpdateRequest as RpcRequestAirdropRequest,
  UpdateResponse as RpcRequestAirdropResponse,
  RpcRequestAirdropServiceDefinition,
  RpcRequestAirdropServiceImplementation,
  RpcRequestAirdropServiceClient,
} from './proto/requests/rpc_request_airdrop'

export {
  ReadRequest as SnapshotGetAccountRequest,
  ReadResponse as SnapshotGetAccountResponse,
  SnapshotGetAccountServiceDefinition,
  SnapshotGetAccountServiceImplementation,
  SnapshotGetAccountServiceClient,
} from './proto/requests/snapshot_get_account'

export {
  CreateRequest as SnapshotCreateSnapshotRequest,
  CreateResponse as SnapshotCreateSnapshotResponse,
  RpcSnapshotableAccount as SnapshotSnapshotableAccount,
  RpcCreateSnapshotResult as SnapshotCreateSnapshotResult,
  DeleteRequest as SnapshotDeleteSnapshotRequest,
  DeleteResponse as SnapshotDeleteSnapshotResponse,
  RpcDeleteSnapshotResult as SnapshotDeleteSnapshotResult,
  UpdateRequest as SnapshotDeleteSnapshotsMatchingRequest,
  UpdateResponse as SnapshotDeleteSnapshotsMatchingResponse,
  RpcUpdateSnapshotResult as SnapshotDeleteSnapshotsMatchingResult,
  ReadRequest as SnapshotGetSnaphotableAccountsRequest,
  ReadResponse as SnapshotGetSnaphotableAccountsResponse,
  SnapshotManagementServiceDefinition,
  SnapshotManagementServiceImplementation,
  SnapshotManagementServiceClient,
} from './proto/requests/snapshot_management'

export {
  ReadRequest as SnapshotListSnapshotsRequest,
  ReadResponse as SnapshotListSnapshotsResponse,
  RpcSnapshotMetadata as SnapshotMetadata,
  RpcAccountSummary as SnapshotAccountSummary,
  UpdateRequest as SnapshotRetrieveAccountsInSnapshotRequest,
  UpdateResponse as SnapshotRetrieveAccountsInSnapshotResponse,
  DeleteRequest as SnapshotRestoreAccountsFromLastUpdatedSnapshotRequest,
  DeleteResponse as SnapshotRestoreAccountsFromLastUpdatedSnapshotResponse,
  CreateRequest as SnapshotRestoreAccountsFromSnapshotRequest,
  CreateResponse as SnapshotRestoreAccountsFromSnapshotResponse,
  RpcRestoreResult as SnapshotRestoreResult,
  SnapshotRestoreServiceDefinition,
  SnapshotRestoreServiceImplementation,
  SnapshotRestoreServiceClient,
} from './proto/requests/snapshot_restore'

export {
  ReadRequest as StoreGetAccountDataRequest,
  ReadResponse as StoreGetAccountDataResponse,
  RpcAccountData,
  StoreGetAccountDataServiceDefinition,
  StoreGetAccountDataServiceImplementation,
  StoreGetAccountDataServiceClient,
} from './proto/requests/store_get_account_data'

export {
  ReadRequest as StoreGetDiffedAccountUpdateRequest,
  ReadResponse as StoreGetDiffedAccountUpdateResponse,
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
  UpdateRequest as LabelTransactionRequest,
  UpdateResponse as LabelTransactionResponse,
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

// -----------------
// Signals
// -----------------

export {
  RpcTransactionAccount,
  RpcTransactionUpdate,
} from './proto/signals/geyser_transaction_update'

export { RpcMutatorAccountCloned } from './proto/signals/mutator_account_cloned'

export { RpcValidatorInfo } from './proto/signals/validator_info'

export {
  RpcValidatorHealth,
  rpcValidatorHealthFromJSON,
  rpcValidatorHealthToJSON,
  RpcValidatorStats,
} from './proto/signals/validator_stats'

export { ValidatorStatus } from './proto/signals/validator_status'
