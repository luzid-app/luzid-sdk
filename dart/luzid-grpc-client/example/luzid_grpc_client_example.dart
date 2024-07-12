import 'package:luzid_grpc/proto/requests/validator_ops.pb.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';

Future<void> main() async {
  final client = LuzidGrpcClient();

  // Start Validator
  {
    print('Starting Validator...');
    final ValidatorOpsResponse res = await client.validator
        .validatorOps(ValidatorOpsRequest(op: ValidatorOperation.Start));

    if (res.hasError()) {
      print("Start Validator Error: ${res.error}");
    } else {
      print('Start Validator Response: $res');
    }
  }

  await sleep(500);

  // Stop Validator
  {
    print('Stopping Validator...');
    final ValidatorOpsResponse res = await client.validator
        .validatorOps(ValidatorOpsRequest(op: ValidatorOperation.Stop));

    if (res.hasError()) {
      print("Stop Validator Error: ${res.error}");
    } else {
      print('Stop Validator Response: $res');
    }
  }

  return client.close();
}

Future<void> sleep([milliseconds = 100]) {
  return Future.delayed(Duration(milliseconds: milliseconds));
}
