import 'package:equatable/equatable.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';

import 'api/app.dart';
import 'api/meta.dart';
import 'api/mutator.dart';
import 'api/ping.dart';
import 'api/release_info.dart';
import 'api/rpc.dart';
import 'api/snapshot.dart';
import 'api/store.dart';
import 'api/transaction.dart';
import 'api/validator.dart';
import 'api/workspace.dart';

export 'api/app.dart';
export 'api/meta.dart';
export 'api/mutator.dart';
export 'api/ping.dart';
export 'api/release_info.dart';
export 'api/rpc.dart';
export 'api/snapshot.dart';
export 'api/store.dart';
export 'api/transaction.dart';
export 'api/validator.dart';
export 'api/workspace.dart';

export 'package:luzid_grpc_client/luzid_grpc_client.dart'
    show LuzidGrpcClientOpts;

class LuzidSdkOpts {
  final LuzidGrpcClientOpts? client;
  LuzidSdkOpts({this.client});
}

class LuzidSdk extends Equatable {
  final LuzidGrpcClient _client;
  late final LuzidApp _app;
  late final LuzidMeta _meta;
  late final LuzidMutator _mutator;
  late final LuzidPing _ping;
  late final LuzidRpc _rpc;
  late final LuzidSnapshot _snapshot;
  late final LuzidStore _store;
  late final LuzidTransaction _transaction;
  late final LuzidValidator _validator;
  late final LuzidWorkspace _workspace;

  LuzidSdk({LuzidSdkOpts? opts, ClientChannelBase? channel})
      : _client = LuzidGrpcClient(opts: opts?.client, channel: channel) {
    _app = LuzidApp(_client);
    _meta = LuzidMeta(_client);
    _mutator = LuzidMutator(_client);
    _ping = LuzidPing(_client);
    _rpc = LuzidRpc(_client);
    _snapshot = LuzidSnapshot(_client);
    _store = LuzidStore(_client);
    _transaction = LuzidTransaction(_client);
    _validator = LuzidValidator(_client);
    _workspace = LuzidWorkspace(_client);
  }

  /// The host to which the client is connected.
  String get host => _client.host;

  /// The port to which the client is connected.
  int get port => _client.port;

  /// Provides access to the Luzid App service.
  ///
  /// **appOps** - Controls the Luzid App, i.e to shut it down.
  LuzidApp get app {
    return _app;
  }

  /// Provides access to the Luzid Meta service with the following methods:
  ///
  /// **getMeta** - Gets configured meta of the Luzid instance
  LuzidMeta get meta {
    return _meta;
  }

  /// Provides access to the Luzid Mutator service with the following methods:
  ///
  /// **cloneAccount** - Clones an account.
  /// **modifyAccount** - Modifies an account.
  LuzidMutator get mutator {
    return _mutator;
  }

  /// Provides access to the Luzid Ping service with the following methods:
  ///
  /// **ping** - Performs a ping request to ensure the Luzid service is running.
  LuzidPing get ping {
    return _ping;
  }

  /// Provides information about the latest released Luzid version as well as
  /// the currently used version, if it is outdated and how to install the
  /// latest version.
  LuzidReleaseInfo get releaseInfo {
    return LuzidReleaseInfo(_client);
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

  /// Checks if the Luzid GRPC service is running and ready to receive requests.
  Future<bool> isServiceRunning() async {
    try {
      await _client.ping.ping();
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Waits for the Luzid GRPC service to be running and ready to receive requests.
  /// If a timeout is provided, it will throw an exception if the service is
  /// not running within that timeout.
  Future<void> waitForService({Duration? timeout}) async {
    final now = DateTime.now();
    while (true) {
      if (await isServiceRunning()) {
        break;
      }
      if (timeout != null && DateTime.now().difference(now) > timeout) {
        throw Exception('Luzid did not start within $timeout');
      }
      await Future.delayed(const Duration(milliseconds: 200));
    }
  }

  Stream<bool> get onChannelConnected => _client.onChannelConnected;
  Stream<bool> get onChannelDisconnected => _client.onChannelDisconnected;

  /// Closes the underlying GRPC client and needs to be called in order for the app to
  /// be able to exit.
  Future<void> close() {
    return _client.close();
  }

  bool get isShutdown {
    return _client.isShutdown;
  }

  @override
  List<Object?> get props => [host, port];
}
