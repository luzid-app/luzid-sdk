import 'package:luzid_sdk/luzid_sdk.dart';
import 'package:ansicolor/ansicolor.dart' show AnsiPen, ansiColorDisabled;

import 'helpers.dart';

// The account we want to modify
const accountAddr = 'Cbwftr3zwy7pu6XQduj8mFRhnPc6vYEepk1LXMfcAxaD';

Future<void> main() async {
  ansiColorDisabled = false;

  final luzid = LuzidSdk();
  final boldPen = AnsiPen()..white(bold: true);

  // 1. Passing no modifications will create the account with defaults if it
  //    didn't exist yet
  {
    print(boldPen('\n1. Initial modification to create account...'));

    // This will assign the account to the system program and add enough
    // lamports to make it rent exempt.
    // You can turn this off by passing `false` to `modifyAccount`.
    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr),
      commitment: RpcCommitment.Confirmed,
    );

    printSolanaExplorerAccountUrl(accountAddr);
  }

  readline();

  // 2. Modify the account data, lamports will be updated automatically to keep
  //    it rent exempt
  {
    print(boldPen('\n2. Modifying account data...'));

    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr).setData(
        'Hello world! Hola mundo! Hallo Welt!'.codeUnits,
      ),
      commitment: RpcCommitment.Confirmed,
    );

    print(
      'Note that the lamports were updated to keep the account rent exempt.',
    );

    printSolanaExplorerAccountUrl(accountAddr);
  }

  readline();

  // 3. Modify the account owner
  {
    final owner = 'FQAHqBcVHiiiLP8qXKPDQGr3mEXLv7RSdvfHJ3ZLugBV';
    print(boldPen('\n3. Modifying account owner...'));

    await luzid.mutator.modifyAccount(
      AccountModification.forAddr(accountAddr).setOwner(owner),
      commitment: RpcCommitment.Confirmed,
    );

    printSolanaExplorerAccountUrl(accountAddr);
  }

  return luzid.close();
}
