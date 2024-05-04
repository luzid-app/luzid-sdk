import 'package:luzid_sdk/luzid_sdk.dart';
import 'package:ansicolor/ansicolor.dart' show AnsiPen, ansiColorDisabled;

import 'helpers.dart';

// The program accounts we will clone and interact with
const programAddr = 'SoLXmnP9JvL6vJ7TN1VqtTxqsc2izmPfF9CsMDEuRzJ';
const postAddr = '5ZspQX4nw95meJHpXBF425NytnNTDgtLBBGVDK9EWmRy';

Future<void> main() async {
  ansiColorDisabled = false;

  final luzid = LuzidSdk();
  await waitForService(luzid);

  final boldPen = AnsiPen()..white(bold: true);
  final dimPen = AnsiPen()..gray();

  // Subscribe to mutator account cloned events
  final sub = luzid.mutator.subAccountCloned().listen((event) {
    print(
      boldPen('Account cloned sub update: {\n') +
          dimPen('  address: ${event.address}\n  cluster: ${event.cluster}\n}'),
    );
  });

  // 1. Clone a Devnet account of the program which is holding a post
  {
    print(
      boldPen('\n1. Cloning an account of the SolX program from devnet...'),
    );

    await luzid.mutator.cloneAccount(
      LuzidCluster.devnet,
      postAddr,
      commitment: RpcCommitment.Confirmed,
    );

    printSolanaExplorerAccountUrl(postAddr);
  }

  readline();

  // 2. Clone the account of the program itself which will auto-clone the IDL account as well
  {
    print(
      boldPen('\n2. Cloning the SolX program account from devnet...'),
    );

    await luzid.mutator.cloneAccount(
      LuzidCluster.devnet,
      programAddr,
      commitment: RpcCommitment.Confirmed,
    );

    print(
      dimPen(
          'The program account was cloned and you can refresh the Solana explorer and should see anchor data'
          ' for the first account we cloned since now it can access its IDL.'),
    );
  }

  sub.cancel();
  return luzid.close();
}
