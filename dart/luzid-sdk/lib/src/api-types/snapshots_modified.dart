import 'package:luzid_grpc/luzid_grpc.dart' as grpc;

import 'package:equatable/equatable.dart';

class SnapshotsModified extends Equatable {
  final SnapshotModification modification;
  final List<String> snapshotIds;

  const SnapshotsModified({
    required this.modification,
    required this.snapshotIds,
  });

  factory SnapshotsModified.from(grpc.SnapshotsModified snapshotsModified) {
    return SnapshotsModified(
      modification: _SnapshotModificationX.from(snapshotsModified.modification),
      snapshotIds: snapshotsModified.snapshotIds,
    );
  }

  @override
  String toString() {
    return '''
  SnapshotsModified {
    modification: $modification,
    snapshotIds: $snapshotIds
  }''';
  }

  @override
  List<Object?> get props => [
        modification,
        snapshotIds,
      ];
}

enum SnapshotModification {
  added,
  removed,
  modified,
}

extension _SnapshotModificationX on SnapshotModification {
  static SnapshotModification from(grpc.SnapshotModification modification) {
    switch (modification) {
      case grpc.SnapshotModification.Added:
        return SnapshotModification.added;
      case grpc.SnapshotModification.Removed:
        return SnapshotModification.removed;
      case grpc.SnapshotModification.Modified:
        return SnapshotModification.modified;
      default:
        throw Exception('Unknown SnapshotModification: $modification');
    }
  }
}
