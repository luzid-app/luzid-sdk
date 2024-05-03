import 'package:luzid_sdk/luzid_sdk.dart';

import 'helpers.dart';

Future<void> main() async {
  final luzid = LuzidSdk();
  await waitForService(luzid);

  luzid.validator.subValidatorStats().listen((stats) {
    print(stats);
  });

  print(
      'Trigger some validator info update, i.e. turning it off via the first example:\n');
  print('Listening for validator stats updates...');
}
