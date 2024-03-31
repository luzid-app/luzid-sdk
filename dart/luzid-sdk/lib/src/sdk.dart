import 'package:luzid_grpc_client/luzid_grpc_client.dart';

import 'api/app.dart';
import 'api/mutator.dart';
import 'api/rpc.dart';
import 'api/snapshot.dart';
import 'api/validator.dart';

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
  late final LuzidValidator _validator;

  LuzidSdk([LuzidSdkOpts? opts]) : _client = LuzidGrpcClient(opts?.client) {
    _app = LuzidApp(_client);
    _mutator = LuzidMutator(_client);
    _validator = LuzidValidator(_client);
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

  /// Provides access to the Luzid Validator service with the following methods:
  ///
  /// **validatorOps** - Allows to Start/Stop/Restart the validator.
  LuzidValidator get validator {
    return _validator;
  }

  Future<void> close() {
    return _client.close();
  }
}
