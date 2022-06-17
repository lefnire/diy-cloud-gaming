import { StackContext, Api, Table, ReactStaticSite. Auth } from "@serverless-stack/resources";

export function Diy(context: StackContext) {
  const { stack } = context
  // cognito: user logins
  // frontend: <done> -> s3, cloudfront
  // dynamodb (like a spreadsheet): database: user accounts, server lists, friends lists,
  // backend: lambda: typescript -> turn on, off servers; take snapshots; share with friends
  // -- manage EC2 instances (VPCs, Security Groups)

  const tables = createTables(context)
  const api = createApi(context, tables)
  const auth = createAuth(context, api)
  const frontend = createFrontend(context, api, auth)
}

type TableObj = Record<string, Table> // {[k: string]: Table}

function createTables({ stack }: StackContext ): TableObj {

  const instances = new Table(stack, "Instances", {
    fields: {
      userId: "string",
      instanceId: "string", // comes from EC2 (aws-js-sdk)
      storage: "string", // 512 - EBS Volume
      instanceType: "string", // g5.2xlarge
      spot: "binary", // spot instances 90% savings, BUT "volatile" (crashable)
      region: "string", // us-east-1
      createdAt: "number",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "instanceId" },
  })

  const snapshots = new Table(stack, "Snapshots", {
    fields: {
      instanceId: "string",
      snapshotId: "string",
      createdAt: "number"
    }
  })

  return {
    instances,
    snapshots
  }
}

function createApi({stack}: StackContext, tables: TableObj): Api {
  // ApiGateway
  // - Lambda1
  // - Lambda2

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [tables.instances, tables.snapshots],
        environment: {
          SNAPSHOTS_TABLE: tables.snapshots.tableName,
          INSTANCES_TABLE: tables.instances.tableName,
        },
      },
    },
    routes: {
      "GET /instances": "functions/instances/list.handler", // HTTP Verbs (http "protocol")
      "POST /instances": "functions/instances/create.handler",
    },
  })

  // Show the API endpoint in the output
  // asldkfjalfkjadsflkj.execute-url.aws.com
  stack.addOutputs({
    ApiEndpoint: api.url,
  })
  return api
}

function createFrontend({stack}: StackContext, api: Api, auth: Auth) {
  // diy-cloud-box.com
  const site = new ReactStaticSite(stack, "React", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.url,
      REACT_APP_REGION: stack.region,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId
    }
  })

  // Show the API endpoint in the output
  // asdlkfjads.cloudfront.net
  stack.addOutputs({
    FrontendUrl: site.url
  })
  return site
}

function createAuth({stack, app}: StackContext, api: Api) {
  const auth = new Auth(stack, "Auth", {
    login: ["email"],
  })

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return auth
}