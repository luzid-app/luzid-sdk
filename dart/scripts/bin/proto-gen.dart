#!/usr/bin/env dart

import "package:path/path.dart" show basename, dirname, join;
import 'dart:io' show Directory, File, Platform, Process;

class Paths {
  final String dartRoot;
  final String luzidRepoRoot;
  final String luzidGrpc;
  final String protoDir;
  final String protoOutDir;

  final String requestsIn;
  final String signalsIn;
  final String typesIn;

  final String requestsOut;
  final String signalsOut;
  final String typesOut;

  Paths(
    this.dartRoot,
    this.luzidRepoRoot,
    this.luzidGrpc,
    this.protoDir,
    this.protoOutDir,
  )   : requestsIn = join(protoDir, 'requests'),
        signalsIn = join(protoDir, 'signals'),
        typesIn = join(protoDir, 'types'),
        requestsOut = join(protoOutDir, 'requests'),
        signalsOut = join(protoOutDir, 'signals'),
        typesOut = join(protoOutDir, 'types');

  resetOutPaths() {
    if (Directory(protoOutDir).existsSync()) {
      Directory(protoOutDir).deleteSync(recursive: true);
    }

    Directory(requestsOut).createSync(recursive: true);
    Directory(signalsOut).createSync(recursive: true);
    Directory(typesOut).createSync(recursive: true);
  }

  @override
  String toString() => '''
dartRoot: $dartRoot
luzidRepoRoot: $luzidRepoRoot
luzidGrpc: $luzidGrpc
protoDir: $protoDir
protoOutDir: $protoOutDir

requestsIn: $requestsIn
signalsIn: $signalsIn
typesIn: $typesIn

requestsOut: $requestsOut
signalsOut: $signalsOut
typesOut: $typesOut
''';
}

enum ProtoType { request, signal, type }

class ProtoInputs {
  final String protoOutRoot;
  final String protoInRoot;
  final String requestsIn;
  final String signalsIn;
  final String typesIn;

  late final List<String> requests;
  late final List<String> signals;
  late final List<String> types;

  ProtoInputs(
    this.protoOutRoot,
    this.protoInRoot,
    this.requestsIn,
    this.signalsIn,
    this.typesIn,
  ) {
    requests = filesInDir(requestsIn);
    signals = filesInDir(signalsIn);
    types = filesInDir(typesIn);
  }

  filesInDir(String dir) {
    return Directory(dir)
        .listSync()
        .whereType<File>()
        .where((f) => f.path.endsWith('.proto'))
        .map((f) => basename(f.path))
        .toList();
  }

  protoPathArgs() {
    return [
      '--proto_path=$typesIn',
      '--proto_path=$signalsIn',
      '--proto_path=$requestsIn',
      '--proto_path=$protoInRoot',
    ];
  }

  List<String> protoArgsFor(ProtoType type) {
    switch (type) {
      case ProtoType.request:
        return [
          ...protoPathArgs(),
          '--dart_out=grpc:$protoOutRoot/requests',
          ...requests,
        ];
      case ProtoType.signal:
        return [
          ...protoPathArgs(),
          '--dart_out=grpc:$protoOutRoot/signals',
          ...signals,
        ];
      case ProtoType.type:
        return [
          ...protoPathArgs(),
          '--dart_out=grpc:$protoOutRoot/types',
          ...types,
        ];
    }
  }

  @override
  String toString() {
    return '''
requests: $requests
signals: $signals
types: $types
''';
  }
}

Future<void> main(List<String> _) async {
  // Directory of this script
  final dir = dirname(Platform.script.path);
  final moduleRoot = join(dir, '..');
  final dartRoot = join(moduleRoot, '..');
  final dartLuzidGrpc = join(dartRoot, 'luzid-grpc');

  final luzidRepoRoot = join(moduleRoot, '..', '..', '..', 'luzid');
  final luzidGrpc = join(luzidRepoRoot, 'rs', 'luzid-grpc');
  final protoDir = join(luzidGrpc, 'proto');
  final protoOutDir = join(dartLuzidGrpc, 'lib', 'proto');

  final paths =
      Paths(dartRoot, luzidRepoRoot, luzidGrpc, protoDir, protoOutDir);

  print(paths);

  final protoInputs = ProtoInputs(
    paths.protoOutDir,
    paths.protoDir,
    paths.requestsIn,
    paths.signalsIn,
    paths.typesIn,
  );

  paths.resetOutPaths();

  for (final ty in ProtoType.values) {
    final args = protoInputs.protoArgsFor(ty);

    final protocDartResult = await Process.run(
      'protoc',
      args,
    );
    print('protoc ${args.join(' ')}');
    print(protocDartResult.stdout);
    print(protocDartResult.stderr);
    print('protoc dart exit code: ${protocDartResult.exitCode}');
  }
}
