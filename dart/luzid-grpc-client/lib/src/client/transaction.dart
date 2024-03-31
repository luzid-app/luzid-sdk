// -----------------
// TransactionClient
// -----------------
import 'package:grpc/grpc.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

class TransactionClient {
  final TransactionServiceClient _client;

  TransactionClient(ClientChannel channel)
      : _client = TransactionServiceClient(channel);

  Future<LabelTransactionResponse> labelTransaction(
    LabelTransactionRequest request,
  ) {
    return _client.labelTransaction(request);
  }
}
