import 'package:luzid_sdk/luzid_sdk.dart';

import 'helpers.dart';

Future<void> main() async {
  final luzid = LuzidSdk();
  await waitForService(luzid);

  luzid.validator.subValidatorInfo().listen((info) {
    print(info);
  });

  print('Listening for validator info updates...');
}
