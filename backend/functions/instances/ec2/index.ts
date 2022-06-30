import {
  EC2Client,
} from "@aws-sdk/client-ec2"

import {Request, AugmentedRequest} from "./types"
import {createNetwork, NetworkIds} from './networking'
import {createInstance} from './ec2'

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ec2-example-managing-instances.html

export function createServer(req: Request)  {
  const client = new EC2Client({region: req.region})
  const {userId, userIp, region} = req
  const augmentedRequest: AugmentedRequest = {
    ...req,
    client,
    Tags: [
      {Key: "diy:userId", Value: userId}
    ]
  }
  const networkIds = createNetwork(augmentedRequest)
  const ec2 = createInstance(augmentedRequest, networkIds)
}