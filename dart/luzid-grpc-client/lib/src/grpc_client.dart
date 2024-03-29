import 'package:grpc/grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

import 'client/app.dart';
import 'client/mutator.dart';
import 'client/validator.dart';

class LuzidGrpcClientOpts {
  String? host;
  int? port;

  LuzidGrpcClientOpts({this.host, this.port});
}

class LuzidGrpcClient {
  final ClientChannel _channel;
  AppClient? _app;
  MutatorClient? _mutator;
  ValidatorClient? _validator;

  LuzidGrpcClient([LuzidGrpcClientOpts? opts])
      : _channel = createLuzidGrpcChannel(
            host: opts?.host ?? 'localhost', port: opts?.port ?? 50051);
  AppClient get app {
    _app ??= AppClient(_channel);
    return _app!;
  }

  MutatorClient get mutator {
    _mutator ??= MutatorClient(_channel);
    return _mutator!;
  }

  ValidatorClient get validator {
    _validator ??= ValidatorClient(_channel);
    return _validator!;
  }

  Future<void> close() {
    return _channel.shutdown();
  }
}
