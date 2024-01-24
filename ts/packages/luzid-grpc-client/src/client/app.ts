import { createClient } from '@luzid/grpc-connection'
import type { Channel } from '@luzid/grpc-connection'
import {
  AppOpsRequest,
  AppOpsResponse,
  AppOpsServiceDefinition,
  AppOpsServiceClient,
} from '@luzid/grpc'

export {
  AppOpsRequest,
  AppOpsResponse,
  AppOpsOperation,
  appOpsOperationFromJSON,
  appOpsOperationToJSON,
} from '@luzid/grpc'

class AppOpsClient {
  private readonly client: AppOpsServiceClient

  constructor(channel: Channel) {
    this.client = createClient(AppOpsServiceDefinition, channel)
  }

  appOps(request: AppOpsRequest): Promise<AppOpsResponse> {
    return this.client.appOps(request)
  }
}

// -----------------
// Consolidated AppClient
// -----------------
export class AppClient {
  private readonly appOpsClient: AppOpsClient

  constructor(channel: Channel) {
    this.appOpsClient = new AppOpsClient(channel)
  }

  appOps(request: AppOpsRequest): Promise<AppOpsResponse> {
    return this.appOpsClient.appOps(request)
  }
}
