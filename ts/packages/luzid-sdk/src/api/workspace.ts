import { ClonableWorkspace, Workspace } from '@luzid/grpc'
import { LuzidGrpcClient } from '@luzid/grpc-client'
import { unwrap } from '../core/utils'

export { Workspace }

export class LuzidWorkspace {
  constructor(private readonly client: LuzidGrpcClient) {}

  /**
   * Gets information about the workspace at the given root, namely the following
   * properties of each program in the workspace:
   *
   * - **package**: name of the rust package name as defined in the Cargo.toml, i.e `foo`
   * - **deployablePath**: the path to which the program deployable is saved, i.e `target/deploy/foo`
   * - **programId?**: the address of the program if it was found, i.e. via `decclare_id!(..)`
   * - **idlPath?**: the path to the IDL file if it was found, i.e `target/idl/foo.json`
   *
   * @param workspaceRoot - the root of the workspace.
   * @returns the workspace information
   */
  async getWorkspace(workspaceRoot: string): Promise<Workspace> {
    const res = await this.client.workspace.getWorkspace({
      root: workspaceRoot,
    })
    return unwrap(res, 'Luzid workspace.getWorkspace').workspace
  }

  /**
   * Clones the workspace at the given root returns.
   *
   * ```typescript
   * const luzid = new LuzidApi()
   * const signatures = await luzid.workspace.cloneWorkspace('/path/to/workspace/foo', {
   *  'solx': 'SoLXmnP9JvL6vJ7TN1VqtTxqsc2izmPfF9CsMDEuRzJ'
   *  })
   * ```
   *
   * @param workspaceRoot
   * @param programIds allows to provide or override the programId for a given program
   * @returns the signatures of the transactions that were used to perform the
   * cloning and program upgrade
   */
  async cloneWorkspace(
    workspaceRoot: string,
    programIds: Record<string, string> = {}
  ): Promise<string[]> {
    const workspace = await this.getWorkspace(workspaceRoot)

    const res = await this.client.workspace.cloneWorkspace({
      workspace: tryIntoClonable(workspace, programIds),
    })
    return unwrap(res, 'Luzid workspace.cloneWorkspace').signatures
  }

  /**
   * Watches the workspace at the given root after cloning it into the validator.
   *
   * ```typescript
   * const luzid = new LuzidApi()
   * const signatures = await luzid.workspace.watchWorkspace('/path/to/workspace/foo')
   * ```
   *
   * @param workspaceRoot - the root of the workspace.
   * @param programIds allows to provide or override the programId for a given program
   * @returns the signatures of the transactions that were used to perform the
   * cloning and program upgrade
   */
  async watchWorkspace(
    workspaceRoot: string,
    programIds: Record<string, string> = {}
  ): Promise<string[]> {
    const workspace = await this.getWorkspace(workspaceRoot)

    const res = await this.client.workspace.watchWorkspace({
      workspace: tryIntoClonable(workspace, programIds),
    })
    return unwrap(res, 'Luzid workspace.watchWorkspace').signatures
  }

  /**
   * Stops watching the workspace at the given root.
   *
   * ```typescript
   * const luzid = new LuzidApi()
   * const signatures = await luzid.workspace.unwatchWorkspace('/path/to/workspace/foo')
   * ```
   *
   * @param workspaceRoot - the root of the workspace.
   */
  async unwatchWorkspace(workspaceRoot: string): Promise<void> {
    const workspace = await this.getWorkspace(workspaceRoot)

    await this.client.workspace.unwatchWorkspace({
      workspace,
    })
  }

  /**
   * Adds workspace to the list of workspaces that are available to be cloned or
   * watched from the Workspace tab in the Luzid UI.
   * This list persists across restarts of Luzid.
   *
   * @param workspaceRoot - the root of the workspace.
   */
  async addWorkspace(workspaceRoot: string): Promise<void> {
    await this.client.workspace.addWorkspace({
      root: workspaceRoot,
    })
  }

  /**
   * Removes workspace from the list of workspaces that are available to be cloned or
   * watched from the Workspace tab in the Luzid UI.
   * This list persists across restarts of Luzid.
   *
   * @param workspaceRoot - the root of the workspace.
   */
  async removeWorkspace(workspaceRoot: string): Promise<void> {
    await this.client.workspace.removeWorkspace({
      root: workspaceRoot,
    })
  }

  /**
   * Returns the list of workspaces that are available to be cloned or
   * watched from the Workspace tab in the Luzid UI.
   */
  async listWorkspaces(): Promise<string[]> {
    const res = await this.client.workspace.listWorkspaces()
    return unwrap(res, 'Luzid workspace.listWorkspaces').workspaceRoots
  }
}

function tryIntoClonable(
  workspace: Workspace,
  programIds: Record<string, string>
): ClonableWorkspace {
  applyProgramIdOverrides(workspace, programIds, true)
  // At this point all programs have a programId
  return workspace as ClonableWorkspace
}

function applyProgramIdOverrides(
  workspace: Workspace,
  programIds: Record<string, string>,
  requireProgramId: boolean = false
): void {
  for (const program of workspace.programs) {
    const programId = programIds[program.package]
    if (programId != null) {
      program.programId = programId
    } else if (program.programId == null && requireProgramId) {
      throw new Error(
        `Program ${program.package} does not have a programId and is not defined in the programIds argument`
      )
    }
  }
}
