import 'package:fixnum/fixnum.dart';
import 'package:luzid_grpc/luzid_grpc.dart'
    show
        MutatorAccountCloned,
        MutatorCloneAccountRequest,
        MutatorCloneAccountResponse,
        MutatorModifyAccountRequest,
        MutatorModifyAccountResponse,
        RpcAccountModification,
        RpcCommitment,
        RpcModifyAccountOpts;

import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/api-types/cluster.dart';
import 'package:luzid_sdk/src/core/utils.dart';

class AccountModification {
  final RpcAccountModification _inner;
  AccountModification._(String accountAddress)
      : _inner = RpcAccountModification(accountAddress: accountAddress);

  factory AccountModification.forAddr(String accountAddress) {
    return AccountModification._(accountAddress);
  }

  Int64? get lamports => _inner.lamports;
  AccountModification setLamports(Int64 lamports) {
    _inner.lamports = lamports;
    return this;
  }

  String? get owner => _inner.owner;
  AccountModification setOwner(String owner) {
    _inner.owner = owner;
    return this;
  }

  bool? get executable => _inner.executable;
  AccountModification setExecutable(bool executable) {
    _inner.executable = executable;
    return this;
  }

  List<int>? get data => _inner.data;

  /// Sets the data for the account.
  ///
  /// In some cases it is important to ensure the data has a specific size.
  /// As an example anchor's `program.coder.encode()` will encode the data but not ensure
  /// it has a compatible size
  ///
  /// In that case one has to do the following, assuming we're encoding a `Game` account that
  /// is defined at index `0` in the IDL accounts array:
  ///
  /// ```typescript
  /// const data = await program.coder.accounts.encode('Game', gameState)
  /// const gameAccountDef = program.idl.accounts[0]
  /// const size = program.coder.accounts.size(gameAccountDef)
  /// return luzid.mutator.modifyAccount(
  ///   AccountModification.forAddr(gameKeypair.publicKey.toBase58()).setData(
  ///     data,
  ///     { size }
  ///   )
  /// )
  /// ```
  ///
  /// @param data - the data to set
  /// @param opts - optional parameters
  /// @param opts -ze**: the size of the data to set. If not provided, the data will be set as is.
  /// Sets the data for the account.
  ///
  /// In some cases it is important to ensure the data has a specific size.
  /// As an example anchor's `program.coder.encode()` will encode the data but not ensure
  /// it has a compatible size
  /// - [data] - the data to set
  /// - [size] - the size of the data to set. If not provided, the data will be set as is.
  AccountModification setData(List<int> data, {int? size}) {
    if (size != null && size != data.length) {
      assert(
        data.length <= size,
        'When providing opts.size it has to be smaller or equal to data.length.\n'
        'However opts.size: $size is smaller than the data size: ${data.length} bytes.',
      );
      final buf = List<int>.filled(size, 0);
      buf.setAll(0, data);
      _inner.data = buf;
    } else {
      _inner.data = data;
    }
    return this;
  }

  Int64? get rentEpoch => _inner.rentEpoch;
  AccountModification setRentEpoch(Int64 rentEpoch) {
    _inner.rentEpoch = rentEpoch;
    return this;
  }
}

class LuzidMutator {
  final LuzidGrpcClient _client;

  LuzidMutator(this._client);

  /// Clones an account.
  ///
  /// - [cluster] - the cluster to clone the account from (MainnetBeta or Devnet)
  /// - [address] - the pubkey of the account to clone
  /// - [commitment] - the commitment that the clone operation should
  /// reach before `cloneAccount` returns, default is `confirmed`
  Future<MutatorCloneAccountResponse> cloneAccount(
    LuzidCluster cluster,
    String address, {
    RpcCommitment commitment = RpcCommitment.Confirmed,
  }) async {
    assert(
      cluster == LuzidCluster.devnet || cluster == LuzidCluster.mainnetBeta,
      'Invalid cluster $cluster.\n'
      'At this point accounts can only be cloned from MainnetBeta or Devnet.',
    );
    final req = MutatorCloneAccountRequest(
      cluster: cluster.intoGrpcCluster(),
      address: address,
      commitment: commitment,
    );
    final res = await _client.mutator.cloneAccount(req);
    return unwrap(res, 'Luzid mutator.cloneAccount');
  }

  /// Modifies an account.
  ///
  /// - [modification] - the modification to apply to the account
  /// - [commitment] - the commitment that the modify operation should reach before `modifyAccount` returns, default is `confirmed`
  Future<MutatorModifyAccountResponse> modifyAccount(
    AccountModification modification, {
    RpcCommitment commitment = RpcCommitment.Confirmed,
  }) async {
    final req = MutatorModifyAccountRequest(
      modification: modification._inner,
      opts: RpcModifyAccountOpts(commitment: commitment),
    );
    final res = await _client.mutator.modifyAccount(req);
    return unwrap(res, 'Luzid mutator.modifyAccount');
  }

  /// Subscribes to account cloned events.
  ///
  /// This subscription will notify the client of any account cloned events.
  /// The client will receive a `MutatorAccountCloned` event for each account cloned.
  Stream<MutatorAccountCloned> subAccountCloned() {
    return _client.mutator.subAccountCloned();
  }
}
