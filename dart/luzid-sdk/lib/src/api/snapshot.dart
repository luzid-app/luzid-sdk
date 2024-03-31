import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';

class LuzidSnapshot {
  final LuzidGrpcClient client;

  LuzidSnapshot(this.client);

  /// Returns the pubkeys of accounts that can be snapshotted.
  ///
  /// - [includeProgramAccounts] - whether to include program accounts
  /// - [commitment] - the commitment the accounts must have reached
  Future<List<RpcSnapshotableAccount>> getSnaphotableAccounts({
    bool includeProgramAccounts = false,
    RpcCommitment? commitment,
  }) async {
    final req = SnapshotGetSnaphotableAccountsRequest()
      ..includeProgramAccounts = includeProgramAccounts;
    if (commitment != null) {
      req.commitment = commitment;
    }
    final res = await client.snapshot.getSnaphotableAccounts(req);
    return res.accounts;
  }

  /// Lists all snapshots that have been created with Luzid.
  ///
  /// - [filter] - optional filter to apply to the snapshots returned
  Future<List<RpcSnapshotMetadata>> listSnapshots(
      [RpcSnapshotFilter? filter]) async {
    final req = SnapshotListSnapshotsRequest();
    if (filter != null) {
      req.filter = filter;
    }
    final res = await client.snapshot.listSnapshots(req);
    return res.snapshots;
  }

  /// Creates a snapshot of the accounts specified.
  ///
  /// - [snapshotName] - the name to give the snapshot
  /// - [accounts] - the accounts to include in the snapshot
  /// - [description] - description of the snapshot
  /// - [group] - group of the snapshot
  /// - [commitment] - the commitment used to determine the account
  /// state included in the snapshot
  ///
  /// Returns the id of the snapshot and the number of accounts included
  Future<RpcCreateSnapshotResult> createSnapshot(
    String snapshotName,
    List<String> accounts, {
    String? description,
    String? group,
    RpcCommitment? commitment,
  }) async {
    final request = SnapshotCreateSnapshotRequest(
      name: snapshotName,
      accounts: accounts,
      description: description,
      group: group,
      commitment: commitment,
    );
    final res = await client.snapshot.createSnapshot(request);
    return res.result;
  }

  /// Deletes the snapshot with the given id if it exists.
  ///
  /// - [snapshotId] - the id of the snapshot to delete
  ///
  /// Returns the id of the deleted snapshot
  Future<String> deleteSnapshot(String snapshotId) async {
    final request = SnapshotDeleteSnapshotRequest()..snapshotId = snapshotId;
    final res = await client.snapshot.deleteSnapshot(request);
    return res.result.snapshotId;
  }

  /// Deletes all globally stored snaphots.
  ///
  /// - [filter] - optional filter to apply to the snapshots returned
  ///
  /// Returns the ids of the deleted snapshots
  Future<List<String>> deleteSnapshotsMatching(
      [RpcSnapshotFilter? filter]) async {
    final request = SnapshotDeleteSnapshotsMatchingRequest();
    if (filter != null) {
      request.filter = filter;
    }
    final res = await client.snapshot.deleteSnapshotsMatching(request);
    return res.result.snapshotIds;
  }

  /// Returns the information of all accounts that are in a snapshot.
  ///
  /// - [snapshotId] - the id of the snapshot to retrieve accounts from
  ///
  /// The returned accounts have the following properties:
  ///
  /// - **address** - the pubkey of the account
  /// - **lamports** - the balance of the account
  /// - **owner** - the owner of the account
  /// - **bytes** - the number of bytes in the account
  /// - **executable** - whether the account is executable
  /// - **slot** - the slot in which the account was created
  Future<List<RpcSnapshotAccountSummary>> retrieveAccountsInSnapshot(
    String snapshotId,
  ) async {
    final req = SnapshotRetrieveAccountsInSnapshotRequest()
      ..snapshotId = snapshotId;
    final res = await client.snapshot.retrieveAccountsInSnapshot(req);
    return res.accounts;
  }

  /// Restores accounts from a snapshot.
  ///
  /// - [snapshotId] - the id of the snapshot to retrieve accounts from
  /// - [accounts] - the accounts to restore, not provided all accounts inside the snapshot will be restored
  /// - [deleteSnapshotAfterRestore] - whether to delete the snapshot after it was restored (default: false)
  /// - [commitment] - the commitment the restore transaction must reach before this method returns
  Future<RpcSnapshotRestoreResult> restoreAccountsFromSnapshot(
    String snapshotId, {
    List<String>? accounts,
    bool deleteSnapshotAfterRestore = false,
    RpcCommitment? commitment,
  }) async {
    final req = SnapshotRestoreAccountsFromSnapshotRequest(
      snapshotId: snapshotId,
      accounts: accounts != null ? VecString(items: accounts) : null,
      commitment: commitment,
    );
    final res = await client.snapshot.restoreAccountsFromSnapshot(req);
    final result = res.result;
    if (deleteSnapshotAfterRestore) {
      await deleteSnapshot(result.snapshotId);
    }
    return result;
  }

  /// Restores accounts from the snapshot that was updated most recently.
  ///
  /// - [accounts] - the accounts to restore, not provided all accounts inside the snapshot will be restored
  /// - [filter] - optional filter to limit the snapshots that are considered when finding the last updated snapshot
  /// - [deleteSnapshotAfterRestore] - whether to delete the snapshot after it was restored (default: false)
  /// - [commitment] - the commitment the restore transaction must reach before this method returns
  Future<RpcSnapshotRestoreResult> restoreAccountsFromLastUpdatedSnapshot({
    List<String>? accounts,
    RpcSnapshotFilter? filter,
    bool deleteSnapshotAfterRestore = false,
    RpcCommitment? commitment,
  }) async {
    final req = SnapshotRestoreAccountsFromLastUpdatedSnapshotRequest(
      accounts: accounts != null ? VecString(items: accounts) : null,
      filter: filter,
      commitment: commitment,
    );
    final res =
        await client.snapshot.restoreAccountsFromLastUpdatedSnapshot(req);
    final result = res.result;
    if (deleteSnapshotAfterRestore) {
      await deleteSnapshot(result.snapshotId);
    }
    return result;
  }
}
