import {v4} from "uuid"
import handler_ from "util/handler";
import dynamoDb from "util/dynamodb";
import {InstanceForm, InstanceRequest, Instance} from '../../../frontend/src/store/schemas'
// import {createServer} from './ec2'

export const handler = handler_(async (event) => {
  const form = InstanceForm.parse(JSON.parse(event.body!))
  const id = v4()
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId

  const tableRow = await dynamoDb.put({
    TableName: process.env.INSTANCES_TABLE,
    Item: {
      ...form,
      id,
      userId,
      state: "pending",
      createdAt: Date.now(),
      instanceId: null
    }
  });

  return {}

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
