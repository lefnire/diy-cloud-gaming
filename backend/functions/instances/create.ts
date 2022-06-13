import * as uuid from "uuid";
import AWS from "aws-sdk";
import {APIGatewayProxyHandlerV2} from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  // in the case of GET, there's body
  // in the case of POST, we need a body (instanceType, storage, etc)
  if (!event.body) {
    throw "Body required"
  }
  const data = JSON.parse(event.body);

  // -- form --
  // instanceType
  // storage
  // spot
  // region
  // -- we need --
  // userId
  // createdAt

  // instanceId is generated from create EC2 instance
  const instanceId = uuid.v1()

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // The attributes of the item to be created
      userId: "123", // The id of the author
      instanceId,
      createdAt: Date.now(), // Current Unix timestamp
      ...data
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}