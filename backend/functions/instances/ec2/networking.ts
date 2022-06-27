import { EC2Client,
  CreateVpcCommand,
  CreateSubnetCommand,
    DescribeAvailabilityZonesCommand,
    CreateSecurityGroupCommand,
    AuthorizeSecurityGroupIngressCommand,
    AuthorizeSecurityGroupEgressCommand
} from "@aws-sdk/client-ec2";

const aws = new EC2Client({region: 'us-east-1'});
import {Region} from './types'

interface NetworkData {
  client: EC2Client
  userId: string
  userIp: string
  region: Region
}

type NetworkDataWithTags = NetworkData & {
  tags: {Key: string, Value: string}[]
}


export async function createNetwork(data: NetworkData) {
  const {userId, userIp, region} = data
  const Tags = [
    {Key: "diy:userId", Value: userId}
  ]

  // TODO @Brett how to get these get the tags into the resources we're creating?
  // TODO replace ingress user ip adderss below with userIp from above

  const createdVpc = await aws.send(new CreateVpcCommand({
    CidrBlock: "10.97.0.0/18",
    // TagSpecifications: {Tags}
  }))
  const {VpcId} = createdVpc.Vpc!

  const azs = await aws.send(new DescribeAvailabilityZonesCommand({}))
  const firstAvailableAz = azs.AvailabilityZones![0].ZoneId

  const createdSubnet = await aws.send(new CreateSubnetCommand({
    VpcId,
    AvailabilityZone: firstAvailableAz,
    CidrBlock: '10.97.0.0/24'
  }))

  const sg = await aws.send(new CreateSecurityGroupCommand({
    VpcId,
    GroupName: "Gaming Security Group",
    Description: "Our Security Group",

  }))
  const {GroupId} = sg
  const authEgress = await aws.send(new AuthorizeSecurityGroupEgressCommand({
    GroupId,
    CidrIp: "0.0.0.0/0",
    FromPort: -1,
    ToPort: -1

  }))

  const rules = [
    {from: 38810, to: 38840, protocol: "TCP", name: "Virtual Deaktop VR"},
    {from: 38810, to: 38840, protocol: "UDP", name: "Virtual Deaktop VR"},
    {from: 8443, to: 8443, protocol: "TCP", name: "NiceDCV"},
    {from: 8443, to: 8443, protocol: "UDP", name: "NiceDCV"},
    {from: 8000, to: 8040, protocol: "TCP", name: "Parsec"},
  ]

  await Promise.all(rules.map(async function CreateRule(rule) {
    const authIngress = await aws.send(new AuthorizeSecurityGroupIngressCommand({
      GroupId,
      CidrIp: "191.213.28.1/32",
      FromPort: rule.from,
      ToPort: rule.to,
      IpProtocol: "rule.protocol,",
      SourceSecurityGroupName: rule.name,

    }))
  }))
}