import { StackContext, Api, Table } from "@serverless-stack/resources";

export function Diy(context: StackContext) {
  const { stack } = context
  // cognito: user logins
  // frontend: <done> -> s3, cloudfront
  // dynamodb (like a spreadsheet): database: user accounts, server lists, friends lists,
  // backend: lambda: typescript -> turn on, off servers; take snapshots; share with friends
  // -- manage EC2 instances (VPCs, Security Groups)

  const tables = createTables(context)
  const api = createApi(context, tables)
}

type TableObj = Record<string, Table> // {[k: string]: Table}

function createTables({ stack }: StackContext ): TableObj {
  const instances = new Table(stack, "Instances", {
    fields: {
      userId: "string",
      instanceId: "string", // comes from EC2 (aws-js-sdk)
      storage: "string", // 512
      instanceType: "string", // g5.2xlarge
      spot: "binary", // spot instances 90% savings, BUT "volatile" (crashable)
      region: "string", // us-east-1
      createdAt: "number"
    },
    primaryIndex: { partitionKey: "userId", sortKey: "instanceId" },
  });

  return {
    instances,
    // friends
  }
}

function createApi({stack}: StackContext, tables: TableObj) {
// Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        permissions: [tables.instances],
        environment: {
          TABLE_NAME: tables.instances.tableName,
        },
      },
    },
    routes: {
      "GET /instances": "functions/instances/list.handler", // HTTP Verbs (http "protocol")
      "GET /instances/:instanceId": "functions/instances/get.handler",
      "POST /instances": "functions/instances/create.handler",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}