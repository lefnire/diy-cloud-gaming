import {v4} from "uuid"
import handler from "util/handler";
import dynamoDb from "util/dynamodb";
import {InstanceForm, InstanceRequest, Instance} from '../../../frontend/src/store/schemas'
// import {createServer} from './ec2'

export const main = handler(async (event) => {
  const form = InstanceForm.parse(JSON.parse(event.body!))
  const id = v4() // database id, NOT instanceId (from ec2.createInstance)
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId

  const Item = {
    ...form,
    id,
    userId,
    state: "pending",
    createdAt: Date.now(),
    instanceId: null
  }
  const tableRow = await dynamoDb.put({
    TableName: process.env.INSTANCES_TABLE,
    Item,
  });

  return Item

  // const actualServer = await createServer({
  //   ...form,
  //   userIp: "xxx",
  //   userId: userId
  // })
  //
  // return await dynamoDb.update({
  //   TableName: process.env.INSTANCES_TABLE,
  //   // 'Key' defines the partition key and sort key of the item to be updated
  //   Key: {
  //     userId,
  //     id
  //   },
  //   UpdateExpression: "SET instanceId = :instanceId",
  //   ExpressionAttributeValues: {
  //     ":instanceId": actualServer.instanceId
  //   },
  //   ReturnValues: "ALL_ATTRIBUTES",
  // })
});
