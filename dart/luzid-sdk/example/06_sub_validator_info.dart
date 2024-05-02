import 'package:luzid_sdk/luzid_sdk.dart';

Future<void> main() async {
  final luzid = LuzidSdk();

  luzid.validator.subValidatorInfo().listen((info) {
    print(info);
  });

  print('Listening for validator info updates...');
}
