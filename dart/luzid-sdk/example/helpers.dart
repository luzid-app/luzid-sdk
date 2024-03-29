import 'dart:io';

import 'package:ansicolor/ansicolor.dart' show AnsiPen;

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
