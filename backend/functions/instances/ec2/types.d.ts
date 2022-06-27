import {EC2Client, TagSpecification, Tag} from "@aws-sdk/client-ec2";
import {InstanceRequest} from "../../../../frontend/src/store/schemas"

// TODO get a list from AWS somehow. Can just copy/paste from their website, but better to pull from a
// service or maybe they have it in their TypeScript files somewhere
export type Region = 'us-east-1' | 'us-east-2' | 'us-west-1' | 'us-west-2'

export type Request = InstanceRequest
export type AugmentedRequest = Request & {
  client: EC2Client
  Tags: Tag[]
}