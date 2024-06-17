import 'dart:async';

import 'package:grpc/grpc.dart';
import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc_client/src/client/workspace.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

import 'client/app.dart';
import 'client/mutator.dart';
import 'client/ping.dart';
import 'client/rpc.dart';
import 'client/snapshot.dart';
import 'client/store.dart';
import 'client/transaction.dart';
import 'client/validator.dart';

export 'client/app.dart';
export 'client/mutator.dart';
export 'client/ping.dart';
export 'client/rpc.dart';
export 'client/snapshot.dart';
export 'client/store.dart';
export 'client/transaction.dart';
export 'client/validator.dart';

export 'package:grpc/grpc_connection_interface.dart' show ClientChannelBase;

class LuzidGrpcClientOpts {
  String? host;
  int? port;

  LuzidGrpcClientOpts({this.host, this.port});
}

class LuzidGrpcClient {
  final ClientChannelBase _channel;
  AppClient? _app;
  MutatorClient? _mutator;
  PingClient? _ping;
  RpcClient? _rpc;
  StoreClient? _store;
  SnapshotClient? _snapshot;
  TransactionClient? _transaction;
  ValidatorClient? _validator;
  WorkspaceClient? _workspace;
  final StreamController<bool> _channelConnected = StreamController.broadcast();

  LuzidGrpcClient({LuzidGrpcClientOpts? opts, ClientChannelBase? channel})
      : _channel = channel ??
            createLuzidGrpcChannel(
                host: opts?.host ?? 'localhost', port: opts?.port ?? 50051) {
    bool connected = false;
    _channel.onConnectionStateChanged.listen((state) {
      switch (state) {
        case ConnectionState.ready:
          if (!connected) {
            connected = true;
            _channelConnected.add(connected);
          }
          break;
        default:
          if (connected) {
            connected = false;
            _channelConnected.add(connected);
          }
          break;
      }
    });
  }

  AppClient get app {
    _app ??= AppClient(_channel);
    return _app!;
  }

  MutatorClient get mutator {
    _mutator ??= MutatorClient(_channel);
    return _mutator!;
  }

  PingClient get ping {
    _ping ??= PingClient(_channel);
    return _ping!;
  }

  RpcClient get rpc {
    _rpc ??= RpcClient(_channel);
    return _rpc!;
  }

  SnapshotClient get snapshot {
    _snapshot ??= SnapshotClient(_channel);
    return _snapshot!;
  }

  StoreClient get store {
    _store ??= StoreClient(_channel);
    return _store!;
  }

  TransactionClient get transaction {
    _transaction ??= TransactionClient(_channel);
    return _transaction!;
  }

  ValidatorClient get validator {
    _validator ??= ValidatorClient(_channel);
    return _validator!;
  }

  WorkspaceClient get workspace {
    _workspace ??= WorkspaceClient(_channel);
    return _workspace!;
  }

  Future<void> close() {
    return _channel.shutdown();
  }

  Stream<bool> get onChannelConnected =>
      _channelConnected.stream.where((event) => event);
  Stream<bool> get onChannelDisconnected =>
      _channelConnected.stream.where((event) => !event);
}
