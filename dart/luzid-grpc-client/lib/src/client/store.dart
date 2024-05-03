import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

// -----------------
// StoreGetAccountDataClient
// -----------------
class StoreGetAccountDataClient {
  final StoreGetAccountDataServiceClient _client;

  StoreGetAccountDataClient(ClientChannelBase channel)
      : _client = StoreGetAccountDataServiceClient(channel);

  Future<StoreGetAccountDataResponse> getAccountData(
    StoreGetAccountDataRequest request,
  ) {
    return _client.getAccountData(request);
  }
}

// -----------------
// StoreGetDiffedAccountUpdateClient
// -----------------
class StoreGetDiffedAccountUpdateClient {
  final StoreGetDiffedAccountUpdateServiceClient _client;

  StoreGetDiffedAccountUpdateClient(ClientChannelBase channel)
      : _client = StoreGetDiffedAccountUpdateServiceClient(channel);

  Future<StoreGetDiffedAccountUpdateResponse> getDiffedAccountUpdate(
    StoreGetDiffedAccountUpdateRequest request,
  ) {
    return _client.getDiffedAccountUpdate(request);
  }
}

// -----------------
// Consolidated StoreClient
// -----------------
class StoreClient {
  final StoreGetAccountDataClient _getAccountDataClient;
  final StoreGetDiffedAccountUpdateClient _getDiffedAccountUpdateClient;

  StoreClient(ClientChannelBase channel)
      : _getAccountDataClient = StoreGetAccountDataClient(channel),
        _getDiffedAccountUpdateClient =
            StoreGetDiffedAccountUpdateClient(channel);

  Future<StoreGetAccountDataResponse> getAccountData(
    StoreGetAccountDataRequest request,
  ) {
    return _getAccountDataClient.getAccountData(request);
  }

  Future<StoreGetDiffedAccountUpdateResponse> getDiffedAccountUpdate(
    StoreGetDiffedAccountUpdateRequest request,
  ) {
    return _getDiffedAccountUpdateClient.getDiffedAccountUpdate(request);
  }
}
