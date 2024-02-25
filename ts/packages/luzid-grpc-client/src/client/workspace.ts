import { createClient } from '@luzid/grpc-connection'
import type { Channel } from '@luzid/grpc-connection'

import {
  GetWorkspaceRequest,
  GetWorkspaceResponse,
  CloneWorkspaceRequest,
  CloneWorkspaceResponse,
  WatchWorkspaceRequest,
  WatchWorkspaceResponse,
  UnwatchWorkspaceRequest,
  UnwatchWorkspaceResponse,
  AddWorkspaceRequest,
  AddWorkspaceResponse,
  RemoveWorkspaceRequest,
  RemoveWorkspaceResponse,
  ListWorkspacesResponse,
  WorkspaceServiceClient,
  WorkspaceServiceDefinition,
} from '@luzid/grpc'

export {
  GetWorkspaceRequest,
  GetWorkspaceResponse,
  CloneWorkspaceRequest,
  CloneWorkspaceResponse,
  WatchWorkspaceRequest,
  WatchWorkspaceResponse,
  UnwatchWorkspaceRequest,
  UnwatchWorkspaceResponse,
  AddWorkspaceRequest,
  AddWorkspaceResponse,
  RemoveWorkspaceRequest,
  RemoveWorkspaceResponse,
  ListWorkspacesResponse,
  WorkspaceProgram,
  Workspace,
  ClonableWorkspaceProgram,
  ClonableWorkspace,
} from '@luzid/grpc'

// -----------------
// WorkspaceGetClient
// -----------------
class WorkspaceGetClient {
  private readonly client: WorkspaceServiceClient

  constructor(channel: Channel) {
    this.client = createClient(WorkspaceServiceDefinition, channel)
  }

  getWorkspace(request: GetWorkspaceRequest): Promise<GetWorkspaceResponse> {
    return this.client.getWorkspace(request)
  }
}

// -------------------
// WorkspaceCloneClient
// -------------------
class WorkspaceCloneClient {
  private readonly client: WorkspaceServiceClient

  constructor(channel: Channel) {
    this.client = createClient(WorkspaceServiceDefinition, channel)
  }

  cloneWorkspace(
    request: CloneWorkspaceRequest
  ): Promise<CloneWorkspaceResponse> {
    return this.client.cloneWorkspace(request)
  }
}

// ---------------------
// WorkspaceWatchClient
// ---------------------
class WorkspaceWatchClient {
  private readonly client: WorkspaceServiceClient

  constructor(channel: Channel) {
    this.client = createClient(WorkspaceServiceDefinition, channel)
  }

  watchWorkspace(
    request: WatchWorkspaceRequest
  ): Promise<WatchWorkspaceResponse> {
    return this.client.watchWorkspace(request)
  }

  unwatchWorkspace(
    request: UnwatchWorkspaceRequest
  ): Promise<UnwatchWorkspaceResponse> {
    return this.client.unwatchWorkspace(request)
  }
}

// -------------------
// WorkspacePersistClient
// -------------------
class WorkspacePersistClient {
  private readonly client: WorkspaceServiceClient

  constructor(channel: Channel) {
    this.client = createClient(WorkspaceServiceDefinition, channel)
  }

  addWorkspace(request: AddWorkspaceRequest): Promise<AddWorkspaceResponse> {
    return this.client.addWorkspace(request)
  }

  removeWorkspace(
    request: RemoveWorkspaceRequest
  ): Promise<RemoveWorkspaceResponse> {
    return this.client.removeWorkspace(request)
  }

  listWorkspaces(): Promise<ListWorkspacesResponse> {
    return this.client.listWorkspaces({})
  }
}

// -----------------
// Consolidated WorkspaceClient
// -----------------
export class WorkspaceClient {
  private readonly getWorkspaceClient: WorkspaceGetClient
  private readonly cloneWorkspaceClient: WorkspaceCloneClient
  private readonly watchWorkspaceClient: WorkspaceWatchClient
  private readonly persistWorkspaceClient: WorkspacePersistClient

  constructor(channel: Channel) {
    this.getWorkspaceClient = new WorkspaceGetClient(channel)
    this.cloneWorkspaceClient = new WorkspaceCloneClient(channel)
    this.watchWorkspaceClient = new WorkspaceWatchClient(channel)
    this.persistWorkspaceClient = new WorkspacePersistClient(channel)
  }

  getWorkspace(request: GetWorkspaceRequest): Promise<GetWorkspaceResponse> {
    return this.getWorkspaceClient.getWorkspace(request)
  }

  cloneWorkspace(
    request: CloneWorkspaceRequest
  ): Promise<CloneWorkspaceResponse> {
    return this.cloneWorkspaceClient.cloneWorkspace(request)
  }

  watchWorkspace(
    request: WatchWorkspaceRequest
  ): Promise<WatchWorkspaceResponse> {
    return this.watchWorkspaceClient.watchWorkspace(request)
  }

  unwatchWorkspace(
    request: UnwatchWorkspaceRequest
  ): Promise<UnwatchWorkspaceResponse> {
    return this.watchWorkspaceClient.unwatchWorkspace(request)
  }

  addWorkspace(request: AddWorkspaceRequest): Promise<AddWorkspaceResponse> {
    return this.persistWorkspaceClient.addWorkspace(request)
  }

  removeWorkspace(
    request: RemoveWorkspaceRequest
  ): Promise<RemoveWorkspaceResponse> {
    return this.persistWorkspaceClient.removeWorkspace(request)
  }

  listWorkspaces(): Promise<ListWorkspacesResponse> {
    return this.persistWorkspaceClient.listWorkspaces()
  }
}
