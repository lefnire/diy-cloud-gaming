import {
  EC2Client,
  AcceptReservedInstancesExchangeQuoteCommand
} from "@aws-sdk/client-ec2";
import {Region} from './types'

const TCP = 6
const UDP = 17

interface NetworkData {
  client: EC2Client
  userId: string
  userIp: string
  region: Region
}

type NetworkDataWithTags = NetworkData & {
  tags: {Key: string, Value: string}[]
}

function getAvailabilityZone({client, region}: NetworkDataWithTags) {
  // 1. Get the *available* Availability Zones for the region the user specified. The AZs which are available for
  //    each region will be different
  const available = client.getAvailableAvailabilityZones(region)

  // 2. Use the first one I guess. They don't need more than 1 for their server, I don't think?
  return available[0]
}

export function createVpc(data: NetworkDataWithTags) {
  const {client, userId, userIp, region, tags} = data
  // what to name these? maybe they name it in the webform?
  const vpcName = `diy:${userId}:${Date.now()}`
  const az = getAvailabilityZone(data)

  return client.createVpc({
    name: vpcName,
    cidr: "10.97.0.0/18", // FIXME this should be dynamically generated, and incremented for each user
    publicSubnets: ["10.97.0.0/24"],
    azs: [az],
    tags
  })
}

function createSecurityGroup(data: NetworkDataWithTags, vpcId: string) {
  const {client, userId, userIp, region, tags} = data
  return client.createSecurityGroup({
    name: `???`,
    description: "Gaming security group (NICE DCV, Remote Desktop, etc)",
    vpcId,
    tags,
    egressRules: ["all-all"],
    ingressWithCidrBlocks: {
      rules: [{
        rule: "ssh-tcp",
        cidr_blocks: userIp
      }, {
        rule: "rdp-tcp",
        cidr_blocks: userIp
      }, {
        from_port: 38810,
        to_port: 38840,
        protocol: UDP,
        description: "Virtual Desktop VR",
        cidr_blocks: userIp
      }, {
        from_port: 38810,
        to_port: 38840,
        protocol: TCP,
        description: "Virtual Desktop VR",
        cidr_blocks: userIp
      }, {
        from_port: 8443,
        to_port: 8443,
        protocol: UDP,
        description: "NiceDCV QUIC",
        cidr_blocks: userIp,
      }, {
        from_port:  8443,
        to_port:  8443,
        protocol:  TCP,
        description:  "NiceDCV QUIC",
        cidr_blocks:  userIp,
      }, {
        from_port: 8000,
        to_port: 8040,
        protocol: UDP,
        description: "Parsec",
        cidr_blocks: userIp,
      }]
    }
  })
}

export function createNetwork(data: NetworkData) {
  const {client, userId, userIp, region} = data
  const tags = [
    {Key: "diy:userId", Value: userId}
  ]
  const withTags = {...data, tags}
  const vpc = createVpc(withTags)
  const sg = createSecurityGroup(withTags, vpc.id)
  return vpc
}