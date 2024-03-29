import 'package:grpc/grpc.dart';
import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

// -----------------
// MutatorCloneAccountClient
// -----------------
class MutatorCloneAccountClient {
  final MutatorCloneAccountServiceClient _client;

  MutatorCloneAccountClient(ClientChannel channel)
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

  MutatorModifyAccountClient(ClientChannel channel)
      : _client = MutatorModifyAccountServiceClient(channel);

  Future<MutatorModifyAccountResponse> modifyAccount(
    MutatorModifyAccountRequest request,
  ) {
    return _client.modifyAccount(request);
  }
}

// -----------------
// Consolidated MutatorClient
// -----------------
class MutatorClient {
  final MutatorCloneAccountClient _cloneAccountClient;
  final MutatorModifyAccountClient _modifyAccountClient;

  MutatorClient(ClientChannel channel)
      : _cloneAccountClient = MutatorCloneAccountClient(channel),
        _modifyAccountClient = MutatorModifyAccountClient(channel);

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
}
