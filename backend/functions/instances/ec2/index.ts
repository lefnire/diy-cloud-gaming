import {
  EC2Client,
} from "@aws-sdk/client-ec2"

import {Request, AugmentedRequest} from "./types"
// import {createEc2} from './ec2'
import {createNetwork} from './networking'

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ec2-example-managing-instances.html

export function createServer(form: Request)  {
  const client = new EC2Client({region: form.region})
  const {userId, userIp, region} = form
  const augmentedRequest: AugmentedRequest = {
    ...form,
    client,
    Tags: [
      {Key: "diy:userId", Value: userId}
    ]
  }
  const network = createNetwork(augmentedRequest)
  // const ec2 = createEc2(form, network)

}