import 'dart:io';

import 'package:luzid_sdk/luzid_sdk.dart';
import 'package:ansicolor/ansicolor.dart' show AnsiPen;

import 'helpers.dart';

Future<void> main() async {
  final luzid = LuzidSdk();
  await waitForService(luzid);

  final boldPen = AnsiPen()..white(bold: true);

  // 1. Stop the validator (it is starts automatically when you launch Luzid)
  {
    print(boldPen('\n1. Stopping the validator...'));
    await luzid.validator.stop();

    // NOTE: solana web3 is only available for flutter apps so we skip version checks
    // and so on

    print('* Have a look at the toggle in the UI to see it is down');

    readline();
  }

  // 2. Start Validator
  {
    print(boldPen('\n2. Starting the validator...'));
    await luzid.validator.start();
    print('* Have a look at the toggle in the UI to see it up again');

    readline();
  }

  // 3. Restart Validator
  {
    print(boldPen('\n3. Restarting the validator...'));
    await luzid.validator.restart();
  }

  return luzid.close();
}
