import {InstanceWithUserId} from "../../../../common/instances";
import {createEc2} from './ec2'
import {createNetwork} from './networking'

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ec2-example-managing-instances.html

export function createServer(form: InstanceWithUserId): EC2Server  {
  const network = createNetwork(form)
  const ec2 = createEc2(form, network)

}