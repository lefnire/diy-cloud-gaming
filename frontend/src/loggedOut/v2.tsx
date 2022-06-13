import React from 'react'
import ReactMarkdown from "react-markdown";
const content = `
## Business Model

Users can clone this repo and run their own AWS servers; it's open source after all. But it can be a pain in the butt. I tried helping people to get it running on Reddit, and it was an uphill battle for people who don't program. So for people who want to use this service, but not be fussed with the technicals, they can run the service no *our* AWS account - for a service fee. 

To enable this, we'll use SST to provide a front-end / back-end that lets them:

* Create an account, add a credit card
* Select their AWS region (us-east-1, us-west-2, etc) to minimize latency
* Register their IP for port-forwarding to the VPC. They may share their account with friends too, who could add their own IP.
* Spin up an EC2 server. They can select the hardware, defaults to \`g5.2xlarge\`. It will create the server, show them the Windows password, and give them instructions:
  * Like: download Parsec here, use the Windows password shown to log in
  * Once you're in, download Oculus Home, Steam, etc. 
  * Keep the browser window up. When you close it, your EC2 server will be shut down (to save you money). 
* Take backups (EC2 Snapshots) of their server. Eg, maybe they want one server for VR and one for flat gaming. This lets them minimize each server's storage (say 512MB) and limit running software for performance gain.

We'll store user accounts in [Cognito](https://aws.amazon.com/cognito/), data in [DynamoDB](https://aws.amazon.com/dynamodb). We'll have a cron job that looks for inactive sessions to shut down the EC2 servers. We'll track a user's AWS usage via [allocation tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html). We'll track their usage, save something to DynamoDB, and then charge them at the end of the month whatever resources they used plus a 3-5% "convenience fee".

Note: since this project is open source, choosing the fee will be what makes us competitive against whomever might fork our repo and host it the exact same business for a lower fee. So we'll want it high enough to make money, low enough to make competing against us inconvenient.

## Technology

The language for all this is JavaScript. Importantly you'll be using [TypeScript](https://www.typescriptlang.org/), which is a modification on JavaScript that makes it easier to write bug-free code. They call it "strong typing", you specify what types (like number, string, etc) variables are in advance, so your editor (VSCode through Github Codespaces) can red-underling things when there are obvious bugs.

### Serverless Stack (SST)

[SST](http://serverless-stack.com/) is a project, similar to CDK or Terraform, that makes it easy to string up your AWS resources. It will help you host React front-ends, Lambda back-ends, DynamoDB databases, Cognito user-authentication, etc. Most of the web stuff we'll be doing is pretty cookie-cutter, so managing how all these services interact with each other is a waste of time; that's what SST does for us. Learn SST first, then move on.

### React

The front-end code (the website) will be written in [React](https://reactjs.org/). Specifically we'll use [create-react-app](https://create-react-app.dev/) to make setting up the React stuff easier. We'll host the React codebase in \`/frontend\` of our SST project, and SST will take care of getting that online for us.

### Servers

The core aspect of our servers is [g5.2xlarge](https://aws.amazon.com/ec2/instance-types/g5/) [EC2](https://aws.amazon.com/ec2/) instances. Currently these are spun up via Terraform, but we'll migrate away from Terraform to CDK. These servers will be contained behind a [VPC](https://aws.amazon.com/vpc/). 

While those GPU-based EC2 instances are the main part, we'll also add some other services via SST so users can:
* Setup an account
* Register their current IP for port-forwarding to the EC2 instance
* Take backups (EC2 Snapshots) of their server
* and more

For these miscellaneous features, we'll be using [Lambda](https://aws.amazon.com/lambda/), [DynamoDB](https://aws.amazon.com/dynamodb), and some other tools (SNS, SQS, etc). Don't get overwhelmed, most of this stuff will be handled by SST. The real server heavy-lifting is EC2 on CDK

### CDK

The simple server stuff (Lambda, React, DynamoDB, etc) SST will handle on our behalf. For the more complex stuff, we'll use CDK. SST is just a simplicity-wrapper on CDK, so once it's time to do heavy-lifting we're not actually switching languages, we're just diving deeper. Again, **SST is CDK** - just a simplicity wrapper. 

The current codebase uses [Terraform](https://www.terraform.io/). Terraform is fantastic, but it limits the flexibility for certain things we'll need (I'll explain later) where CDK provides more programmatic flexibility. Plus, since CDK is JavaScript (TypeScript) and SST uses CDK, this adds way more consistency so there's not a million frameworks.

---

### Nuances

There are lots of technical gotchas to keep in mind.

#### G/V Quotas

\`g5.2xlarge\` instances aren't available to use for new accounts. Users need to reach out to AWS sales, have an annoying conversation to them proving they want to use these instances for legitimate use, that they're following security best-practices, etc. The reason is (1) AWS has a limited supply of these GPU EC2 instances, and they wanna make sure it goes to businesses, not individuals (they need money after all). And (2) people who don't follow best security practices (like [MFA](https://aws.amazon.com/iam/features/mfa/)) are easily hacked. Then hackers spin up \`g5.2xlarge\` instances for crypto-mining, drain the user's bank account (as AWS charges), and AWS ends up fronting some responsibility. So they're very strict.

This is another reason our "convenience fee" will be great. Users need to request & prove for a quota; we'll already have done that for \`x\` amount of servers in \`y\` regions in advance.

#### EBS Costs

A running EC2 instance is expensive, so we need to make it clear they should shut down their server when they're not gaming. Better yet, we should have a browser tab open (which they need anyway to click "Start", show Windows password and instructions, etc) - and when that tab gets closed or is idle for 3 hours or something, we should auto-shutdown the instance. That's something we need to build. 

Well that's not enough. A shut-down EC2 instance doesn't get charged, but it's hard-drive does. So a 1TB [EBS](https://aws.amazon.com/ebs/) (Elastic Block Store, just an AWS hard-drive) that's idle with software installed on it still gets charged. Mine was about $3/day. So what we need to do is take Snapshots of the EBS volume, then actually delete the server completely. Then when they click "Start" next time, it will create a new server from scratch from that backup.

This is a pain in the ass. But it does have a benefit: users can have multiple servers (say for their friends in different locations) running from those backups, not just a single EC2 instance.
`

export default function V2() {
  return <ReactMarkdown children={content} />
}