import 'dart:async';

import 'package:grpc/grpc.dart';
import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc_client/src/client/meta.dart';
import 'package:luzid_grpc_client/src/client/workspace.dart';
import 'package:luzid_grpc_client/src/core/channel.dart';

import 'client/app.dart';
import 'client/mutator.dart';
import 'client/ping.dart';
import 'client/release_info.dart';
import 'client/rpc.dart';
import 'client/snapshot.dart';
import 'client/store.dart';
import 'client/transaction.dart';
import 'client/validator.dart';

export 'client/app.dart';
export 'client/meta.dart';
export 'client/mutator.dart';
export 'client/ping.dart';
export 'client/release_info.dart';
export 'client/rpc.dart';
export 'client/snapshot.dart';
export 'client/store.dart';
export 'client/transaction.dart';
export 'client/validator.dart';

export 'package:grpc/grpc_connection_interface.dart' show ClientChannelBase;

const defaultHost = 'localhost';
const defaultPort = 50051;

class LuzidGrpcClientOpts {
  String? host;
  int? port;

  LuzidGrpcClientOpts({this.host, this.port});
}

class LuzidGrpcClient {
  final ClientChannelBase _channel;
  final String host;
  final int port;
  bool _isShutdown;
  AppClient? _app;
  MetaClient? _meta;
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
      : host = opts?.host ?? defaultHost,
        port = opts?.port ?? defaultPort,
        _isShutdown = false,
        _channel = channel ??
            createLuzidGrpcChannel(
                host: opts?.host ?? defaultHost,
                port: opts?.port ?? defaultPort) {
    bool connected = false;
    _channel.onConnectionStateChanged.listen((state) {
      switch (state) {
        case ConnectionState.ready:
          if (!connected) {
            connected = true;
            print('Connected to gRPC server at port ${opts?.port}');
            _channelConnected.add(connected);
          }
          break;
        case ConnectionState.shutdown:
          if (!_isShutdown && connected) {
            connected = false;
            _channelConnected.add(connected);
          }
          _isShutdown = true;
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

  MetaClient get meta {
    _meta ??= MetaClient(_channel);
    return _meta!;
  }

  MutatorClient get mutator {
    _mutator ??= MutatorClient(_channel);
    return _mutator!;
  }

  PingClient get ping {
    _ping ??= PingClient(_channel);
    return _ping!;
  }

  ReleaseInfoClient get releaseInfo {
    return ReleaseInfoClient(_channel);
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
    _isShutdown = true;
    return _channel.shutdown();
  }

  bool get isShutdown {
    return _isShutdown;
  }

  Stream<bool> get onChannelConnected =>
      _channelConnected.stream.where((event) => event);
  Stream<bool> get onChannelDisconnected =>
      _channelConnected.stream.where((event) => !event);
}
