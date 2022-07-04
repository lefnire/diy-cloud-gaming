import {v4} from "uuid"
import handler from "util/handler";
import dynamoDb from "util/dynamodb";
import {InstanceForm, InstanceRequest, Instance} from '../../../frontend/src/store/schemas'
import {createServer} from './ec2'


async function createActualServer(instanceRequest: InstanceRequest, rowEntry: any) {
  const {id, userId} = rowEntry
   const actualServer = await createServer(instanceRequest)

  return await dynamoDb.update({
    TableName: process.env.INSTANCES_TABLE,
    // 'Key' defines the partition key and sort key of the item to be updated
    Key: {
      userId,
      id
    },
    UpdateExpression: "SET instanceId = :instanceId",
    ExpressionAttributeValues: {
      ":instanceId": actualServer.instanceId
    },
    ReturnValues: "ALL_ATTRIBUTES",
  })
}

export const main = handler(async (event) => {
  const form = InstanceForm.parse(JSON.parse(event.body!))
  const userIp = event['requestContext']['identity']['sourceIp']
  const id = v4() // database id, NOT instanceId (from ec2.createInstance)
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId
  // const userIp = event['requestContext']['http']['sourceIp']
  const userIp = event['requestContext']['identity']['sourceIp']

  const rowEntry = {
    ...form,
    id,
    userId,
    state: "pending",
    createdAt: Date.now(),
    instanceId: null
  }
  const tableRow = await dynamoDb.put({
    TableName: process.env.INSTANCES_TABLE,
    Item: rowEntry,
  });

  const instanceRequest: InstanceRequest = {
    ...form,
    userId,
    userIp
  }
  createActualServer(instanceRequest, rowEntry)

  return rowEntry
});
