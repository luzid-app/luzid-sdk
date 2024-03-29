import 'package:grpc/grpc.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

import 'client/app.dart';
import 'client/validator.dart';

class LuzidGrpcClientOpts {
  String? host;
  int? port;

  LuzidGrpcClientOpts({this.host, this.port});
}

class LuzidGrpcClient {
  final ClientChannel _channel;
  ValidatorClient? _validator;
  AppClient? _app;

  LuzidGrpcClient([LuzidGrpcClientOpts? opts])
      : _channel = createLuzidGrpcChannel(
            host: opts?.host ?? 'localhost', port: opts?.port ?? 50051);

  ValidatorClient get validator {
    _validator ??= ValidatorClient(_channel);
    return _validator!;
  }

  AppClient get app {
    _app ??= AppClient(_channel);
    return _app!;
  }

  Future<void> close() {
    return _channel.shutdown();
  }
}
