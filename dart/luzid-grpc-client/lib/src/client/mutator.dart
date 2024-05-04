import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

// -----------------
// MutatorCloneAccountClient
// -----------------
class MutatorCloneAccountClient {
  final MutatorCloneAccountServiceClient _client;

  MutatorCloneAccountClient(ClientChannelBase channel)
      : _client = MutatorCloneAccountServiceClient(channel);

  Future<MutatorCloneAccountResponse> cloneAccount(
    MutatorCloneAccountRequest request,
  ) {
    return _client.cloneAccount(request);
  }
}

// -----------------
// MutatorModifyAccountClient
// -----------------
class MutatorModifyAccountClient {
  final MutatorModifyAccountServiceClient _client;

  MutatorModifyAccountClient(ClientChannelBase channel)
      : _client = MutatorModifyAccountServiceClient(channel);

  Future<MutatorModifyAccountResponse> modifyAccount(
    MutatorModifyAccountRequest request,
  ) {
    return _client.modifyAccount(request);
  }
}

// -----------------
// MutatorAccountClonedSubClient
// -----------------
class _MutatorAccountClonedSubClient {
  final MutatorAccountClonedSubClient _client;

  _MutatorAccountClonedSubClient(ClientChannelBase channel)
      : _client = MutatorAccountClonedSubClient(channel);

  ResponseStream<MutatorAccountCloned> subAccountCloned() {
    return _client.subMutatorAccountCloned(Empty());
  }
}

// -----------------
// Consolidated MutatorClient
// -----------------
class MutatorClient {
  final MutatorCloneAccountClient _cloneAccountClient;
  final MutatorModifyAccountClient _modifyAccountClient;
  final _MutatorAccountClonedSubClient _accountClonedSubClient;

  MutatorClient(ClientChannelBase channel)
      : _cloneAccountClient = MutatorCloneAccountClient(channel),
        _modifyAccountClient = MutatorModifyAccountClient(channel),
        _accountClonedSubClient = _MutatorAccountClonedSubClient(channel);

  Future<MutatorCloneAccountResponse> cloneAccount(
    MutatorCloneAccountRequest request,
  ) {
    return _cloneAccountClient.cloneAccount(request);
  }

  Future<MutatorModifyAccountResponse> modifyAccount(
    MutatorModifyAccountRequest request,
  ) {
    return _modifyAccountClient.modifyAccount(request);
  }

  ResponseStream<MutatorAccountCloned> subAccountCloned() {
    return _accountClonedSubClient.subAccountCloned();
  }
}
