import 'package:grpc/grpc.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

// -----------------
// SnapshotGetAccountClient
// -----------------
class SnapshotGetAccountClient {
  final SnapshotGetAccountServiceClient _client;

  SnapshotGetAccountClient(ClientChannel channel)
      : _client = SnapshotGetAccountServiceClient(channel);

  Future<SnapshotGetAccountResponse> getAccount(
    SnapshotGetAccountRequest request,
  ) {
    return _client.getAccount(request);
  }
}

// -----------------
// SnapshotManagementClient
// -----------------
class SnapshotManagementClient {
  final SnapshotManagementServiceClient _client;

  SnapshotManagementClient(ClientChannel channel)
      : _client = SnapshotManagementServiceClient(channel);

  Future<SnapshotGetSnaphotableAccountsResponse> getSnaphotableAccounts(
    SnapshotGetSnaphotableAccountsRequest request,
  ) {
    return _client.getSnaphotableAccounts(request);
  }

  Future<SnapshotCreateSnapshotResponse> createSnapshot(
    SnapshotCreateSnapshotRequest request,
  ) {
    return _client.createSnapshot(request);
  }

  Future<SnapshotDeleteSnapshotResponse> deleteSnapshot(
    SnapshotDeleteSnapshotRequest request,
  ) {
    return _client.deleteSnapshot(request);
  }

  Future<SnapshotDeleteSnapshotsMatchingResponse> deleteSnapshotsMatching(
    SnapshotDeleteSnapshotsMatchingRequest request,
  ) {
    return _client.deleteSnapshotsMatching(request);
  }
}

// -----------------
// SnapshotRestoreClient
// -----------------
class SnapshotRestoreClient {
  final SnapshotRestoreServiceClient _client;

  SnapshotRestoreClient(ClientChannel channel)
      : _client = SnapshotRestoreServiceClient(channel);

  Future<SnapshotListSnapshotsResponse> listSnapshots(
    SnapshotListSnapshotsRequest request,
  ) {
    return _client.listSnapshots(request);
  }

  Future<SnapshotRetrieveAccountsInSnapshotResponse> retrieveAccountsInSnapshot(
    SnapshotRetrieveAccountsInSnapshotRequest request,
  ) {
    return _client.retrieveAccountsInSnapshot(request);
  }

  Future<SnapshotRestoreAccountsFromSnapshotResponse>
      restoreAccountsFromSnapshot(
    SnapshotRestoreAccountsFromSnapshotRequest request,
  ) {
    return _client.restoreAccountsFromSnapshot(request);
  }

  Future<SnapshotRestoreAccountsFromLastUpdatedSnapshotResponse>
      restoreAccountsFromLastUpdatedSnapshot(
    SnapshotRestoreAccountsFromLastUpdatedSnapshotRequest request,
  ) {
    return _client.restoreAccountsFromLastUpdatedSnapshot(request);
  }
}

// -----------------
// Consolidated SnapshotClient
// -----------------
class SnapshotClient {
  final SnapshotGetAccountClient _getAccountClient;
  final SnapshotManagementClient _managementClient;
  final SnapshotRestoreClient _restoreClient;

  SnapshotClient(ClientChannel channel)
      : _getAccountClient = SnapshotGetAccountClient(channel),
        _managementClient = SnapshotManagementClient(channel),
        _restoreClient = SnapshotRestoreClient(channel);

  Future<SnapshotGetAccountResponse> getAccount(
    SnapshotGetAccountRequest request,
  ) {
    return _getAccountClient.getAccount(request);
  }

  Future<SnapshotGetSnaphotableAccountsResponse> getSnaphotableAccounts(
    SnapshotGetSnaphotableAccountsRequest request,
  ) {
    return _managementClient.getSnaphotableAccounts(request);
  }

  Future<SnapshotCreateSnapshotResponse> createSnapshot(
    SnapshotCreateSnapshotRequest request,
  ) {
    return _managementClient.createSnapshot(request);
  }

  Future<SnapshotDeleteSnapshotResponse> deleteSnapshot(
    SnapshotDeleteSnapshotRequest request,
  ) {
    return _managementClient.deleteSnapshot(request);
  }

  Future<SnapshotDeleteSnapshotsMatchingResponse> deleteSnapshotsMatching(
    SnapshotDeleteSnapshotsMatchingRequest request,
  ) {
    return _managementClient.deleteSnapshotsMatching(request);
  }

  Future<SnapshotListSnapshotsResponse> listSnapshots(
    SnapshotListSnapshotsRequest request,
  ) {
    return _restoreClient.listSnapshots(request);
  }

  Future<SnapshotRetrieveAccountsInSnapshotResponse> retrieveAccountsInSnapshot(
    SnapshotRetrieveAccountsInSnapshotRequest request,
  ) {
    return _restoreClient.retrieveAccountsInSnapshot(request);
  }

  Future<SnapshotRestoreAccountsFromSnapshotResponse>
      restoreAccountsFromSnapshot(
    SnapshotRestoreAccountsFromSnapshotRequest request,
  ) {
    return _restoreClient.restoreAccountsFromSnapshot(request);
  }

  Future<SnapshotRestoreAccountsFromLastUpdatedSnapshotResponse>
      restoreAccountsFromLastUpdatedSnapshot(
    SnapshotRestoreAccountsFromLastUpdatedSnapshotRequest request,
  ) {
    return _restoreClient.restoreAccountsFromLastUpdatedSnapshot(request);
  }
}
