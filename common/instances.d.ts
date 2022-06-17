export interface User {
  email: string
  username: string
}

export interface Friend {
  email: string
  username: string
  online: boolean
  // sharedInstances: Instance[]
}

export type InstanceForm = {
  instanceType: string // 'g5.2xlarge' | 'g5.xlarge' | 'p2.xlarge'
  storage: string
  spot: boolean
  region: string // 'us-west-2' | 'us-west-1' | 'us-east-1' | 'us-east-2'
}

export type InstanceWithUserId = InstanceForm & {
  userId: string
  userIp: string
}

export type InstanceHydrated = InstanceForm & {
  instanceId: string
  createdAt: number // Date
  userId: string
}