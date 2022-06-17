// TODO get a list from AWS somehow. Can just copy/paste from their website, but better to pull from a
// service or maybe they have it in their TypeScript files somewhere
import {EC2Client} from "@aws-sdk/client-ec2";

export type Region = 'us-east-1' | 'us-east-2' | 'us-west-1' | 'us-west-2'

interface Request {
  client: EC2Client
  userId: string
  userIp: string
  region: Region
}