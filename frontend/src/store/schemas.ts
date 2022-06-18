import {z} from 'zod'

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

export const UserId = z.string()
export type UserId = z.infer<typeof UserId>

export const InstanceForm = z.object({
  instanceType: z.string(), // 'g5.2xlarge' | 'g5.xlarge' | 'p2.xlarge'
  storage: z.number().gte(32),
  spot: z.boolean(),
  region: z.string() // 'us-west-2' | 'us-west-1' | 'us-east-1' | 'us-east-2'
})
export type InstanceForm = z.infer<typeof InstanceForm>

export const InstanceRequest = InstanceForm.extend({
  userId: UserId,
  userIp: z.string()
})
export type InstanceRequest = z.infer<typeof InstanceRequest>

export const Instance = InstanceForm.extend({
  id: z.string(),
  createdAt: z.number(),
  instanceId: z.string()
})
export type Instance = z.infer<typeof Instance>