import 'package:luzid_grpc/proto/requests/validator_ops.pb.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';

Future<void> main() async {
  final client = LuzidGrpcClient();

  // Start Validator
  {
    print('Starting Validator...');
    final ReadResponse res =
        await client.validator.validatorOps(ReadRequest(op: Operation.Start));

    if (res.hasError()) {
      print("Start Validator Error: ${res.error}");
    } else {
      print('Start Validator Response: $res');
    }
  }

  // Stop Validator
  {
    print('Stopping Validator...');
    final ReadResponse res =
        await client.validator.validatorOps(ReadRequest(op: Operation.Stop));

    if (res.hasError()) {
      print("Stop Validator Error: ${res.error}");
    } else {
      print('Stop Validator Response: $res');
    }
  }

  return client.close();
}
