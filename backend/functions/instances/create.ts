import * as uuid from "uuid";
import handler from "util/handler";
import dynamoDb from "util/dynamodb";
import {InstanceForm, InstanceHydrated} from '../../../common/instances'
import {createServer} from './ec2'

export const main = handler(async (event) => {
  const form = JSON.parse(event.body) as InstanceForm

  const formWithUserId = {
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
