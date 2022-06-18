import {
  StackContext,
  Api,
  Table,
  ReactStaticSite,
  Auth,
  Bucket
} from "@serverless-stack/resources";

const DOMAIN = 'diy-cloud-box.com'

export function Diy(context: StackContext) {
  const tables = createTables(context)
  const api = createApi(context, {tables})
  const auth = createAuth(context, {api})
  const frontend = createFrontend(context, {api, auth})
}

function createTables({ stack }: StackContext ): Record<string, Table> {
  const instances = new Table(stack, "Instances3", {
    fields: {
      userId: "string",
      id: "string",
      state: "string", // pending | starting | start | stopped | etc
      instanceId: "string", // comes from EC2 (aws-js-sdk)
      storage: "string", // 512 - EBS Volume
      instanceType: "string", // g5.2xlarge
      spot: "binary", // spot instances 90% savings, BUT "volatile" (crashable)
      region: "string", // us-east-1
      createdAt: "number",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "id" },
  })

  const snapshots = new Table(stack, "Snapshots", {
    fields: {
      instanceId: "string",
      snapshotId: "string",
      createdAt: "number"
    },
    primaryIndex: { partitionKey: "instanceId", sortKey: "snapshotId" },
  })

  return {
    instances,
    snapshots
  }
}

function createApi(
  {stack, app}: StackContext,
  {tables}: {tables: Record<string, Table>}
): Api {
  const api = new Api(stack, "Api", {
    customDomain: app.stage === "prod" ? `api.${DOMAIN}` : undefined,
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [tables.instances],
        environment: {
          INSTANCES_TABLE: tables.instances.tableName,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
        },
      },
    },
    routes: {
      "GET /instances": "functions/instances/list.main", // HTTP Verbs (http "protocol")
      // "GET /instances/{id}": "functions/instances/get.main",
      "POST /instances": "functions/instances/create.main",
    },
  })

  stack.addOutputs({
    ApiEndpoint: api.customDomainUrl || api.url,
  })
  return api
}

function createFrontend(
  { stack, app }: StackContext,
  {api, bucket, auth}: {api: Api, bucket?: Bucket, auth: Auth}
) {

  // Define our React app
  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    customDomain:
      app.stage === "prod" ? DOMAIN : undefined,
    // Pass in our environment variables
    environment: {
      REACT_APP_API_URL: api.customDomainUrl || api.url,
      REACT_APP_REGION: app.region,
      // REACT_APP_BUCKET: bucket.bucketName,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
  });
}

function createAuth(
  { stack, app }: StackContext,
  { api }: {api: Api}
): Auth {
  // Create a Cognito User Pool and Identity Pool
  const auth = new Auth(stack, "Auth", {
    login: ["email"],
  });

  auth.attachPermissionsForAuthUsers([
    // Allow access to the API
    api,
    // Policy granting access to a specific folder in the bucket
    // new iam.PolicyStatement({
    //   actions: ["s3:*"],
    //   effect: iam.Effect.ALLOW,
    //   resources: [
    //     bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
    //   ],
    // }),
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return auth
}

export function createBucket(
  { stack }: StackContext
) {
  return new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });
}

