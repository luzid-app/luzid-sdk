import 'dart:io';

import 'package:ansicolor/ansicolor.dart' show AnsiPen;
import 'package:luzid_sdk/luzid_sdk.dart';

printSolanaExplorerAccountUrl(String accountAddr, {String? tab}) {
  final linkPen = AnsiPen()..blue(bold: true);
  final url = Uri.https('explorer.solana.com', '/address/$accountAddr',
      {'cluster': 'custom', 'customUrl': 'http://localhost:8899'});
  print(linkPen(url));
}

String? readline() {
  print('Press Enter to continue...');
  return stdin.readLineSync();
}

Future<void> waitForService(LuzidSdk luzid) async {
  if (await luzid.isServiceRunning()) {
    return;
  }
  print('Please the start Luzid service, I\'ll wait ...');
  return luzid.waitForService();
}
