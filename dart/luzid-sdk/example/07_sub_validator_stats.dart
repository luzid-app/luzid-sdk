import 'package:luzid_sdk/luzid_sdk.dart';

Future<void> main() async {
  final luzid = LuzidSdk();

  luzid.validator.subValidatorStats().listen((stats) {
    print(stats);
  });

  print(
      'Trigger some validator info update, i.e. turning it off via the first example:\n');
  print('Listening for validator stats updates...');
}
