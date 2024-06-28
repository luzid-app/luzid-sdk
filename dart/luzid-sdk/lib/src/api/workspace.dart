import 'package:luzid_grpc/luzid_grpc.dart';
import 'package:luzid_grpc_client/luzid_grpc_client.dart';
import 'package:luzid_sdk/src/core/utils.dart';

export 'package:luzid_grpc/luzid_grpc.dart'
    show RpcWorkspace, WorkspaceWatchChanged;

class LuzidWorkspace {
  final LuzidGrpcClient client;

  LuzidWorkspace(this.client);

  /// Gets information about the workspace at the given root, namely the following
  /// properties of each program in the workspace:
  ///
  /// - **package**: name of the rust package name as defined in the Cargo.toml, i.e `foo`
  /// - **deployablePath**: the path to which the program deployable is saved, i.e `target/deploy/foo`
  /// - **programId?**: the address of the program if it was found, i.e. via `decclare_id!(..)`
  /// - **idlPath?**: the path to the IDL file if it was found, i.e `target/idl/foo.json`
  ///
  /// [workspaceRoot] - the root of the workspace.
  /// returns the workspace information
  Future<RpcWorkspace> getWorkspace(String workspaceRoot) async {
    final res = await client.workspace.getWorkspace(
      GetWorkspaceRequest(root: workspaceRoot),
    );
    return unwrap(res, 'Luzid workspace.getWorkspace').workspace;
  }

  /// Clones the workspace at the given root returns.
  ///
  /// ```dart
  /// final luzid = LuzidApi();
  /// final signatures = await luzid.workspace.cloneWorkspace('/path/to/workspace/foo', {
  ///  'solx': 'SoLXmnP9JvL6vJ7TN1VqtTxqsc2izmPfF9CsMDEuRzJ'
  ///  });
  /// ```
  ///
  /// [workspaceRoot] - the root of the workspace.
  /// [programIds] allows to provide or override the programId for a given program
  /// returns the signatures of the transactions that were used to perform the
  /// cloning and program upgrade
  Future<List<String>> cloneWorkspace(String workspaceRoot,
      [Map<String, String> programIds = const {}]) async {
    final workspace = await getWorkspace(workspaceRoot);

    final res = await client.workspace.cloneWorkspace(
      CloneWorkspaceRequest(
        workspace: tryIntoClonable(workspace, programIds),
      ),
    );
    return unwrap(res, 'Luzid workspace.cloneWorkspace').signatures;
  }

  /// Watches the workspace at the given root after cloning it into the validator.
  ///
  /// ```dart
  /// final luzid = LuzidApi();
  /// final signatures = await luzid.workspace.watchWorkspace('/path/to/workspace/foo');
  /// ```
  ///
  /// [workspaceRoot] - the root of the workspace.
  /// [programIds] allows to provide or override the programId for a given program
  /// returns the signatures of the transactions that were used to perform the
  /// cloning and program upgrade
  Future<List<String>> watchWorkspace(String workspaceRoot,
      [Map<String, String> programIds = const {}]) async {
    final workspace = await getWorkspace(workspaceRoot);

    final res = await client.workspace.watchWorkspace(
      WatchWorkspaceRequest(
        workspace: tryIntoClonable(workspace, programIds),
      ),
    );
    return unwrap(res, 'Luzid workspace.watchWorkspace').signatures;
  }

  /// Stops watching the workspace at the given root.
  ///
  /// ```dart
  /// final luzid = LuzidApi();
  /// final signatures = await luzid.workspace.unwatchWorkspace('/path/to/workspace/foo');
  /// ```
  ///
  /// [workspaceRoot] - the root of the workspace.
  Future<void> unwatchWorkspace(String workspaceRoot) async {
    final workspace = await getWorkspace(workspaceRoot);

    await client.workspace.unwatchWorkspace(
      UnwatchWorkspaceRequest(workspace: workspace),
    );
  }

  /// Adds workspace to the list of workspaces that are available to be cloned or
  /// watched from the Workspace tab in the Luzid UI.
  /// This list persists across restarts of Luzid.
  ///
  /// [workspaceRoot] - the root of the workspace.
  Future<void> addWorkspace(String workspaceRoot) async {
    await client.workspace.addWorkspace(
      AddWorkspaceRequest(root: workspaceRoot),
    );
  }

  /// Removes workspace from the list of workspaces that are available to be cloned or
  /// watched from the Workspace tab in the Luzid UI.
  /// This list persists across restarts of Luzid.
  ///
  /// [workspaceRoot] - the root of the workspace.
  Future<void> removeWorkspace(String workspaceRoot) async {
    await client.workspace.removeWorkspace(
      RemoveWorkspaceRequest(root: workspaceRoot),
    );
  }

  /// Returns the list of workspaces that are available to be cloned or
  /// watched from the Workspace tab in the Luzid UI.
  Future<List<String>> listWorkspaces() async {
    final res = await client.workspace.listWorkspaces();
    return unwrap(res, 'Luzid workspace.listWorkspaces').workspaceRoots;
  }

  /// Subscribes to workspaces being watched or unwatched.
  /// The emitted type includes the workspace root and the watch state.
  Stream<WorkspaceWatchChanged> subWorkspaceWatchChanged() {
    return client.workspace.subWorkspaceWatchChanged();
  }
}

RpcClonableWorkspace tryIntoClonable(
  RpcWorkspace workspace,
  Map<String, String> programIds,
) {
  applyProgramIdOverrides(workspace, programIds, true);
  // At this point all programs have a programId
  return RpcClonableWorkspace(
    root: workspace.root,
    programs: workspace.programs.map((e) => RpcClonableWorkspaceProgram(
          package: e.package,
          deployablePath: e.deployablePath,
          programId: e.programId,
          idlPath: e.idlPath,
        )),
  );
}

void applyProgramIdOverrides(
  RpcWorkspace workspace,
  Map<String, String> programIds,
  bool requireProgramId,
) {
  for (final program in workspace.programs) {
    final programId = programIds[program.package];
    if (programId != null) {
      program.programId = programId;
    } else if (!program.hasProgramId() && requireProgramId) {
      throw Exception(
        'Program ${program.package} does not have a programId and is not defined in the programIds argument',
      );
    }
  }
}
