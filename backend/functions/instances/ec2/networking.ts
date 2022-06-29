import {
  EC2Client,
  CreateVpcCommand,
  CreateSubnetCommand,
  DescribeAvailabilityZonesCommand,
  CreateSecurityGroupCommand,
  AuthorizeSecurityGroupIngressCommand,
  AuthorizeSecurityGroupEgressCommand
} from "@aws-sdk/client-ec2";

import {AugmentedRequest, Region} from './types'

export async function createNetwork(request: AugmentedRequest) {
  const {client, Tags, userId, userIp, region} = request

  const createdVpc = await client.send(new CreateVpcCommand({
    CidrBlock: "10.97.0.0/18",
    TagSpecifications: [{ResourceType: "vpc", Tags}]
  }))
  const {VpcId} = createdVpc.Vpc!

  const azs = await client.send(new DescribeAvailabilityZonesCommand({}))
  const firstAvailableAz = azs.AvailabilityZones![0].ZoneId

  const createdSubnet = await client.send(new CreateSubnetCommand({
    VpcId,
    AvailabilityZone: firstAvailableAz,
    CidrBlock: '10.97.0.0/24',
    TagsSpecifications: [{ResourceType: "subnet", Tags}]
  }))
// TODO @Brett how to get these get the tags into the resources we're creating?
  // TODO replace ingress user ip adderss below with userIp from above
  const sg = await client.send(new CreateSecurityGroupCommand({
    VpcId,
    GroupName: "Gaming Security Group",
    Description: "Our Security Group",
    TagSpecifications: [{ResourceType: "security-group", Tags}]
  }))
  const {GroupId} = sg
  const authEgress = await client.send(new AuthorizeSecurityGroupEgressCommand({
    GroupId,
    CidrIp: "0.0.0.0/0",
    FromPort: -1,
    ToPort: -1,
  }))

  const rules = [
    {from: 38810, to: 38840, protocol: "TCP", name: "Virtual Deaktop VR"},
    {from: 38810, to: 38840, protocol: "UDP", name: "Virtual Deaktop VR"},
    {from: 8443, to: 8443, protocol: "TCP", name: "NiceDCV"},
    {from: 8443, to: 8443, protocol: "UDP", name: "NiceDCV"},
    {from: 8000, to: 8040, protocol: "TCP", name: "Parsec"},
  ]

  await Promise.all(rules.map(async function CreateRule(rule) {
    const authIngress = await client.send(new AuthorizeSecurityGroupIngressCommand({
      GroupId,
      CidrIp: "191.213.28.1/32",
      FromPort: rule.from,
      ToPort: rule.to,
      IpProtocol: "rule.protocol,",
      SourceSecurityGroupName: rule.name,
    }))
  }))
}