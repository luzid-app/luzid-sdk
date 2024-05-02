import 'package:luzid_sdk/luzid_sdk.dart';

Future<void> main() async {
  final luzid = LuzidSdk();

  luzid.validator.subValidatorStatus().listen((update) {
    print(update);
  });

  print(
      'Trigger some validator status changes, i.e. turning it off via the first example:\n');
  print('Listening for validator status updates...');
}
