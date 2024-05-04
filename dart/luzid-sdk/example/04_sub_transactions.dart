import 'package:luzid_sdk/luzid_sdk.dart';

import 'helpers.dart';

Future<void> main() async {
  final luzid = LuzidSdk();
  await waitForService(luzid);

  luzid.transaction.subTransactions().listen((update) {
    print(update);
  });

  print('Send some transactions, i.e. via an airdrop by running:\n');
  print(
      'solana airdrop -u localhost 2.2 SoLXmnP9JvL6vJ7TN1VqtTxqsc2izmPfF9CsMDEuRzJ\n');
  print('Listening for transactions...');
}
