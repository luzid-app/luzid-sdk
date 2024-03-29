import 'package:luzid_grpc_client/luzid_grpc_client.dart';

import 'api/app.dart';
import 'api/mutator.dart';
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
  late final LuzidValidator _validator;

  LuzidSdk([LuzidSdkOpts? opts]) : _client = LuzidGrpcClient(opts?.client) {
    _app = LuzidApp(_client);
    _mutator = LuzidMutator(_client);
    _validator = LuzidValidator(_client);
  }

  LuzidApp get app {
    return _app;
  }

  LuzidMutator get mutator {
    return _mutator;
  }

  LuzidValidator get validator {
    return _validator;
  }

  Future<void> close() {
    return _client.close();
  }
}
