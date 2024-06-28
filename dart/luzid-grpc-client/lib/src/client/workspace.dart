import 'package:grpc/grpc_connection_interface.dart';
import 'package:luzid_grpc/luzid_grpc.dart';

// -----------------
// WorkspaceGetClient
// -----------------
class WorkspaceGetClient {
  final WorkspaceServiceClient _client;

  WorkspaceGetClient(ClientChannelBase channel)
      : _client = WorkspaceServiceClient(channel);

  Future<GetWorkspaceResponse> getWorkspace(GetWorkspaceRequest request) {
    return _client.getWorkspace(request);
  }
}

// -------------------
// WorkspaceCloneClient
// -------------------
class WorkspaceCloneClient {
  final WorkspaceServiceClient _client;

  WorkspaceCloneClient(ClientChannelBase channel)
      : _client = WorkspaceServiceClient(channel);

  Future<CloneWorkspaceResponse> cloneWorkspace(
    CloneWorkspaceRequest request,
  ) {
    return _client.cloneWorkspace(request);
  }
}

// ---------------------
// WorkspaceWatchClient
// ---------------------
class WorkspaceWatchClient {
  final WorkspaceServiceClient _client;

  WorkspaceWatchClient(ClientChannelBase channel)
      : _client = WorkspaceServiceClient(channel);

  Future<WatchWorkspaceResponse> watchWorkspace(
    WatchWorkspaceRequest request,
  ) {
    return _client.watchWorkspace(request);
  }

  Future<UnwatchWorkspaceResponse> unwatchWorkspace(
    UnwatchWorkspaceRequest request,
  ) {
    return _client.unwatchWorkspace(request);
  }
}

// -------------------
// WorkspacePersistClient
// -------------------
class WorkspacePersistClient {
  final WorkspaceServiceClient _client;

  WorkspacePersistClient(ClientChannelBase channel)
      : _client = WorkspaceServiceClient(channel);

  Future<AddWorkspaceResponse> addWorkspace(AddWorkspaceRequest request) {
    return _client.addWorkspace(request);
  }

  Future<RemoveWorkspaceResponse> removeWorkspace(
    RemoveWorkspaceRequest request,
  ) {
    return _client.removeWorkspace(request);
  }

  Future<ListWorkspacesResponse> listWorkspaces() {
    return _client.listWorkspaces(Empty());
  }
}

// -----------------
// WorkspaceWatchChangedClient
// -----------------
class WorkspaceWatchChangedClient {
  final WorkspaceWatchChangedSubClient _client;

  WorkspaceWatchChangedClient(ClientChannelBase channel)
      : _client = WorkspaceWatchChangedSubClient(channel);

  Stream<WorkspaceWatchChanged> subWorkspaceWatchChanged() {
    return _client.subWorkspaceWatchChanged(Empty());
  }
}

// -----------------
// Consolidated WorkspaceClient
// -----------------
class WorkspaceClient {
  final WorkspaceGetClient _getWorkspaceClient;
  final WorkspaceCloneClient _cloneWorkspaceClient;
  final WorkspaceWatchClient _watchWorkspaceClient;
  final WorkspacePersistClient _persistWorkspaceClient;
  final WorkspaceWatchChangedClient _workspaceWatchChangedClient;

  WorkspaceClient(ClientChannelBase channel)
      : _getWorkspaceClient = WorkspaceGetClient(channel),
        _cloneWorkspaceClient = WorkspaceCloneClient(channel),
        _watchWorkspaceClient = WorkspaceWatchClient(channel),
        _persistWorkspaceClient = WorkspacePersistClient(channel),
        _workspaceWatchChangedClient = WorkspaceWatchChangedClient(channel);

  Future<GetWorkspaceResponse> getWorkspace(GetWorkspaceRequest request) {
    return _getWorkspaceClient.getWorkspace(request);
  }

  Future<CloneWorkspaceResponse> cloneWorkspace(
    CloneWorkspaceRequest request,
  ) {
    return _cloneWorkspaceClient.cloneWorkspace(request);
  }

  Future<WatchWorkspaceResponse> watchWorkspace(
    WatchWorkspaceRequest request,
  ) {
    return _watchWorkspaceClient.watchWorkspace(request);
  }

  Future<UnwatchWorkspaceResponse> unwatchWorkspace(
    UnwatchWorkspaceRequest request,
  ) {
    return _watchWorkspaceClient.unwatchWorkspace(request);
  }

  Future<AddWorkspaceResponse> addWorkspace(AddWorkspaceRequest request) {
    return _persistWorkspaceClient.addWorkspace(request);
  }

  Future<RemoveWorkspaceResponse> removeWorkspace(
    RemoveWorkspaceRequest request,
  ) {
    return _persistWorkspaceClient.removeWorkspace(request);
  }

  Future<ListWorkspacesResponse> listWorkspaces() {
    return _persistWorkspaceClient.listWorkspaces();
  }

  Stream<WorkspaceWatchChanged> subWorkspaceWatchChanged() {
    return _workspaceWatchChangedClient.subWorkspaceWatchChanged();
  }
}
