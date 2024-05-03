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
  final String subsIn;
  final String typesIn;

  final String requestsOut;
  final String subsOut;
  final String typesOut;

  Paths(
    this.dartRoot,
    this.luzidRepoRoot,
    this.luzidGrpc,
    this.protoDir,
    this.protoOutDir,
  )   : requestsIn = join(protoDir, 'requests'),
        subsIn = join(protoDir, 'subs'),
        typesIn = join(protoDir, 'types'),
        requestsOut = join(protoOutDir, 'requests'),
        subsOut = join(protoOutDir, 'subs'),
        typesOut = join(protoOutDir, 'types');

  resetOutPaths() {
    if (Directory(protoOutDir).existsSync()) {
      Directory(protoOutDir).deleteSync(recursive: true);
    }

    Directory(requestsOut).createSync(recursive: true);
    Directory(subsOut).createSync(recursive: true);
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
subsIn: $subsIn
typesIn: $typesIn

requestsOut: $requestsOut
subsOut: $subsOut
typesOut: $typesOut
''';
}

enum ProtoType { request, subs, type }

class ProtoInputs {
  final String protoOutRoot;
  final String protoInRoot;
  final String requestsIn;
  final String subsIn;
  final String typesIn;

  late final List<String> requests;
  late final List<String> subs;
  late final List<String> types;

  ProtoInputs(
    this.protoOutRoot,
    this.protoInRoot,
    this.requestsIn,
    this.subsIn,
    this.typesIn,
  ) {
    requests = filesInDir(requestsIn);
    subs = filesInDir(subsIn);
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
      '--proto_path=$subsIn',
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
      case ProtoType.subs:
        return [
          ...protoPathArgs(),
          '--dart_out=grpc:$protoOutRoot/subs',
          ...subs,
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
subs: $subs
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

  final protoInputs = ProtoInputs(
    paths.protoOutDir,
    paths.protoDir,
    paths.requestsIn,
    paths.subsIn,
    paths.typesIn,
  );

  paths.resetOutPaths();

  for (final ty in ProtoType.values) {
    print('\nGenerating ${ty.toString().split('.').last} protos...');
    final args = protoInputs.protoArgsFor(ty);

    final protocDartResult = await Process.run(
      'protoc',
      args,
    );
    print('protoc ${args.join(' ')}');
    print(protocDartResult.stdout);
    if (protocDartResult.exitCode != 0) {
      print('protoc failed');
      print(protocDartResult.stderr);
      return;
    }
  }

  fixTypeImports(paths);
}

// -----------------
// Type Import Fixes
// -----------------
void fixTypeImports(Paths paths) {
  final requestsDir = Directory(paths.requestsOut);
  final subsDir = Directory(paths.subsOut);
  final typesDir = Directory(paths.typesOut);

  final protoEndings = [
    '.pbenum.dart',
    '.pb.dart',
    '.pbjson.dart',
    '.pbgrpc.dart',
  ];

  // 1. Find all files from the types dir that match a proto ending
  final typeFiles = findFilesEndingWith(typesDir, protoEndings);

  // 2. Find all files from the requests and sub dirs that match a proto ending
  final requestFiles = findFilesEndingWith(requestsDir, protoEndings);
  final subFiles = findFilesEndingWith(subsDir, protoEndings);

  // 3. Replace all lines in request and sub files which match
  //    `import '<type_file>' as  ` with
  //    `import '../types/<type_file>' as  `
  for (final requestFile in [...requestFiles, ...subFiles]) {
    final content = File(requestFile).readAsStringSync();
    final newContent = typeFiles.fold(content, (content, typeFile) {
      final typeFileName = basename(typeFile);
      return content.replaceAll(
        "import '$typeFileName' as",
        "import '../types/$typeFileName' as",
      );
    });
    File(requestFile).writeAsStringSync(newContent);
  }
}

List<String> findFilesEndingWith(Directory dir, List<String> suffixes) {
  return dir
      .listSync()
      .whereType<File>()
      .where((f) => suffixes.any((suffix) => f.path.endsWith(suffix)))
      .map((f) => f.path)
      .toList();
}
