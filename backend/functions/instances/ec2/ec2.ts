import {
  RunInstancesCommand,
  DescribeImagesCommand,
  AllocateAddressCommand,
  CreateKeyPairCommand,
  AssociateAddressCommand,
  GetPasswordDataRequest,
    RequestSpotInstancesCommand
} from "@aws-sdk/client-ec2"
import {AugmentedRequest} from "./types"
import {NetworkIds} from "./networking";

/**
 * Create an EC2 instance.
 * Find the most recent NICE DCV image, and create an instance with that image.
 * Assign public IP address to the instance.
 * Create a key pair for the instance.
 * @param request
 */
export async function createInstance(request: AugmentedRequest, networkIds: NetworkIds): Promise<void> {
  const {client, Tags, userId, userIp, region} = request
  const {VpcId, SubnetId, GroupId} = networkIds

  const ami = await client.send(new DescribeImagesCommand({
    Owners: ["amazon"],
    Filters: [{Name: "name", Values: ["DCV-Windows-*-NVIDIA-gaming-*"]}],
  }))
  const {ImageId} = ami.Images![0] // TODO ensure this is the most recent image

  // SSH key pair (.pem file)
  const keyPair = await client.send(new CreateKeyPairCommand({
    KeyName: `${userId}-diy-key-pair`,
    TagSpecifications: [{ResourceType: "key-pair", Tags}]
  }))
  const KeyName = keyPair.KeyName

  const address = await client.send(new AllocateAddressCommand({
    Domain: "vpc",
    TagSpecifications: [{ResourceType: "address", Tags}]
  }))
  const AllocationId = address.AllocationId!

  const instance = await client.send(new RunInstancesCommand({
    ImageId,
    InstanceType: request.instanceType,
    MinCount: 1,
    MaxCount: 1,
    KeyName,
    TagSpecifications: [{ResourceType: "instance", Tags}],

    // Networking - assign this instance to the VPC we created
    SubnetId,
    SecurityGroupIds: [GroupId],
    NetworkInterfaces: [{
      AssociatePublicIpAddress: true,
      // AllocationId,
    }],

    BlockDeviceMappings: [{
      // DeviceName: "/dev/sda1",
      Ebs: {
        VolumeSize: request.storage,
        VolumeType: "gp3",
        // DeleteOnTermination: true,
        // Encrypted: true,
      },
    }],
  }))
  const {InstanceId} = instance.Instances![0]

  // assign EIP to server
    await client.send(new AssociateAddressCommand({
        AllocationId,
        InstanceId,
    }))


//   // get password
  const [getPasswordResponse] = await client.send(new GetPasswordDataRequest({
    InstanceId
  }))
if (getPasswordResponse.PasswordData) {
  console.log(`Password for ${InstanceId}.': ${getPasswordResponse.PasswordData}`)
} else {
  console.log(`Working on getting the password for  ${InstanceId}.`)
}
}


async function createSpotInstance(request: AugmentedRequest, networkIds: NetworkIds): Promise<void> {
  // handle spot instances
    if (request.spotPrice) {
        const {SpotInstanceRequestId} = await client.send(new RequestSpotInstancesCommand({
            InstanceCount: 1,
            LaunchSpecification: {
            ImageId,
            InstanceType: request.instanceType,
            MinCount: 1,
            MaxCount: 1,
            KeyName,
            TagSpecifications: [{ResourceType: "instance", Tags}],


                SpotPrice: request.spotPrice,
            Type: "one-time",
            ValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
            TagSpecifications: [{ResourceType: "spot-instance-request", Tags}],
        }))
        const {SpotInstanceRequestId: requestId} = requests[0]
        console.log(`Requested spot instance with request ID ${requestId}`)
    }
}