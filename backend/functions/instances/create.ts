import handler from "util/handler";
import dynamoDb from "util/dynamodb";
import {InstanceForm, InstanceFormWithUser, Instance} from '../../../common/schemas'
import {createServer} from './ec2'

export const main = handler(async (event) => {
  const form = InstanceForm.parse(JSON.parse(event.body!))

  const formWithUser: InstanceFormWithUser = {
    ...form,
    userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
  }

  const createdServer = await createServer(form)

  // 1. Create instance
  const instance = {
    ...form,
    instanceId: createdServer.instanceId,
    createdAt: createdServer.createdAt // Date.now(), // Current Unix timestamp
  }


  // 2. save Instance info to DynamoDB
  const params = {
    TableName: process.env.INSTANCES_TABLE,
    Item: instance
  };

  await dynamoDb.put(params);

  return params.Item;
});
