import 'package:luzid_grpc_client/luzid_grpc_client.dart';

import 'api/app.dart';
import 'api/mutator.dart';
import 'api/rpc.dart';
import 'api/snapshot.dart';
import 'api/store.dart';
import 'api/transaction.dart';
import 'api/validator.dart';
import 'api/workspace.dart';

export 'api/mutator.dart' show AccountModification;

class LuzidSdkOpts {
  final LuzidGrpcClientOpts? client;
  LuzidSdkOpts({this.client});
}

class LuzidSdk {
  final LuzidGrpcClient _client;
  late final LuzidApp _app;
  late final LuzidMutator _mutator;
  late final LuzidRpc _rpc;
  late final LuzidSnapshot _snapshot;
  late final LuzidStore _store;
  late final LuzidTransaction _transaction;
  late final LuzidValidator _validator;
  late final LuzidWorkspace _workspace;

  LuzidSdk([LuzidSdkOpts? opts]) : _client = LuzidGrpcClient(opts?.client) {
    _app = LuzidApp(_client);
    _mutator = LuzidMutator(_client);
    _rpc = LuzidRpc(_client);
    _snapshot = LuzidSnapshot(_client);
    _store = LuzidStore(_client);
    _transaction = LuzidTransaction(_client);
    _validator = LuzidValidator(_client);
    _workspace = LuzidWorkspace(_client);
  }

  /// Provides access to the Luzid App service.
  ///
  /// **appOps** - Controls the Luzid App, i.e to shut it down.
  LuzidApp get app {
    return _app;
  }

  /// Provides access to the Luzid Mutator service with the following methods:
  ///
  /// **cloneAccount** - Clones an account.
  /// **modifyAccount** - Modifies an account.
  LuzidMutator get mutator {
    return _mutator;
  }

  /// Provides access to the Luzid RPC service with the following methods:
  ///
  /// **getAccountInfo** - Returns the info for an account.
  /// **requestAirdrop** - Requests to drop SOL to an account.
  LuzidRpc get rpc {
    return _rpc;
  }

  /// Provides access to the Luzid Snapshot service with the following methods:
  ///
  /// **getSnaphotableAccounts** - Returns the pubkeys of accounts that can be snapshotted.
  /// **listSnapshots** - Lists all snapshots that have been created with Luzid.
  /// **createSnapshot** - Creates a snapshot of the accounts specified.
  LuzidSnapshot get snapshot {
    return _snapshot;
  }

  /// Provides access to the Luzid Store service with the following methods:
  ///
  /// **getAccountData** - Returns the data for an account.
  /// **getDiffedAccountUpdate** - Returns the update to an account resulting from a specific transaction.
  LuzidStore get store {
    return _store;
  }

  /// Provides access to the Luzid Transaction service with the following methods:
  ///
  /// **labelTransaction** - Labels a transaction.
  LuzidTransaction get transaction {
    return _transaction;
  }

  /// Provides access to the Luzid Validator service with the following methods:
  ///
  /// **validatorOps** - Allows to Start/Stop/Restart the validator.
  LuzidValidator get validator {
    return _validator;
  }

  /// Provides access to the Luzid Workspace service with the following methods:
  ///
  /// **getWorkspace** - Returns the workspace at the given root.
  /// **cloneWorkspace** - Clones the workspace at the given root.
  /// **watchWorkspace** - Watches the workspace at the given root after cloning it into the validator.
  /// **unwatchWorkspace** - Stops watching the workspace at the given root.
  /// **addWorkspace** - Adds a workspace to the list of workspaces that are available to be cloned or watched from the Workspace tab in the Luzid UI.
  /// **removeWorkspace** - Removes a workspace from the list of workspaces that are available to be cloned or watched from the Workspace tab in the Luzid UI.
  /// **listWorkspaces** - Returns a list of workspaces that are available to be cloned or watched from the Workspace tab in the Luzid UI.
  LuzidWorkspace get workspace {
    return _workspace;
  }

  /// Closes the underlying GRPC client and needs to be called in order for the app to
  /// be able to exit.
  Future<void> close() {
    return _client.close();
  }
}
