/* TypeScript Version:
type AccountModificationBuilder = {
  setLamports(lamports: bigint): AccountModificationBuilder
  setOwner(owner: string): AccountModificationBuilder
  setExecutable(executable: boolean): AccountModificationBuilder

  setData(
    data: Uint8Array,
    opts?: { size?: number }
  ): AccountModificationBuilder
  setRentEpoch(rentEpoch: bigint): AccountModificationBuilder
}

export class AccountModification implements RpcAccountModification {
  private _lamports?: bigint
  private _owner?: string
  private _executable?: boolean
  private _data?: Uint8Array
  private _rentEpoch?: bigint

  private constructor(public readonly accountAddress: string) {}

  static forAddr(accountAddress: string): AccountModificationBuilder {
    return new AccountModification(accountAddress)
  }

  get lamports() {
    return this._lamports
  }
  setLamports(lamports: bigint): AccountModificationBuilder {
    this._lamports = lamports
    return this
  }

  get owner() {
    return this._owner
  }
  setOwner(owner: string): AccountModificationBuilder {
    this._owner = owner
    return this
  }

  get executable() {
    return this._executable
  }
  setExecutable(executable: boolean): AccountModificationBuilder {
    this._executable = executable
    return this
  }

  get data() {
    return this._data
  }

  /**
   * Sets the data for the account.
   *
   * In some cases it is important to ensure the data has a specific size.
   * As an example anchor's `program.coder.encode()` will encode the data but not ensure
   * it has a compatible size
   *
   * In that case one has to do the following, assuming we're encoding a `Game` account that
   * is defined at index `0` in the IDL accounts array:
   *
   * ```typescript
   * const data = await program.coder.accounts.encode('Game', gameState)
   * const gameAccountDef = program.idl.accounts[0]
   * const size = program.coder.accounts.size(gameAccountDef)
   * return luzid.mutator.modifyAccount(
   *   AccountModification.forAddr(gameKeypair.publicKey.toBase58()).setData(
   *     data,
   *     { size }
   *   )
   * )
   * ```
   *
   * @param data - the data to set
   * @param opts - optional parameters
   * @param opts -ze**: the size of the data to set. If not provided, the data will be set as is.
   */
  setData(
    data: Uint8Array,
    opts?: { size?: number }
  ): AccountModificationBuilder {
    if (opts?.size != null && opts.size !== data.length) {
      assert(
        data.length <= opts.size,
        `When providing opts.size it has to be smaller or equal to data.length.\n` +
          `However opts.size: ${opts.size} is smaller than the data size: ${data.length} bytes.`
      )
      const buf = new Uint8Array(opts.size)
      buf.set(data, 0)
      this._data = buf
    } else {
      this._data = data
    }
    return this
  }

  get rentEpoch() {
    return this._rentEpoch
  }
  setRentEpoch(rentEpoch: bigint): AccountModificationBuilder {
    this._rentEpoch = rentEpoch
    return this
  }
}

export class LuzidMutator {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Clones an account.
   *
   * @param cluster - the cluster to clone the account from (MainnetBeta or Devnet)
   * @param address - the pubkey of the account to clone
   * @param opts - optional parameters to further configure how the account is cloned
   * @param opts.commitment - the commitment that the clone operation should
   * reach before `cloneAccount` returns, default is `confirmed`
   */
  async cloneAccount(
    cluster: LuzidCluster,
    address: string,
    opts: { commitment?: Commitment } = {}
  ): Promise<Successful<MutatorCloneAccountResponse>> {
    assert(
      cluster == Cluster.Devnet || cluster == Cluster.MainnetBeta,
      `Invalid cluster ${cluster.toJSON()}.\nAt this point accounts can only be cloned from MainnetBeta or Devnet.`
    )
    const req: MutatorCloneAccountRequest = {
      cluster: intoGrpcCluster(cluster),
      address,
      commitment: rpcCommitmentFromCommitment(opts.commitment),
    }
    const res = await this.client.mutator.cloneAccount(req)
    return unwrap(res, 'Luzid mutator.cloneAccount')
  }

  /**
   * Modifies an account.
   *
   * @param modification - the modification to apply to the account
   * @param opts - optional parameters to further configure how the account is modified
   * @param opts.commitment - the commitment that the modify operation should reach before `modifyAccount` returns, default is `confirmed`
   */
  async modifyAccount(
    modification: AccountModification | AccountModificationBuilder,
    opts: { commitment?: Commitment } = {}
  ): Promise<Successful<MutatorModifyAccountResponse>> {
    const req: MutatorModifyAccountRequest = {
      // Using `as` here so that the user can pass in an AccountModificationBuilder which we know
      // is always an AccountModification exposed via the builder interface.
      // The other option would be to have the user call `build` which is not quite as nice.
      modification: modification as AccountModification,
      opts: { commitment: rpcCommitmentFromCommitment(opts.commitment) },
    }
    const res = await this.client.mutator.modifyAccount(req)
    return unwrap(res, 'Luzid mutator.modifyAccount')
  }
}
*/

// Dart Version:

import 'package:fixnum/fixnum.dart';
import 'package:luzid_grpc/luzid_grpc.dart'
    show
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

  Future<MutatorCloneAccountResponse> cloneAccount(
    Cluster cluster,
    String address, {
    RpcCommitment commitment = RpcCommitment.Confirmed,
  }) async {
    assert(
      cluster == Cluster.devnet || cluster == Cluster.mainnetBeta,
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
}
