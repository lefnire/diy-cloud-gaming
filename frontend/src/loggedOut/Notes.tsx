import React from 'react'
import ReactMarkdown from "react-markdown";

const content = `
## Original blog post

I started this based on following this [AWS guide](https://aws.amazon.com/blogs/gametech/enabling-quest-2-ar-vr-on-ec2-with-nice-dcv/), which worked! But had some problems. So I figured I'd make a project to make it easier, with updated notes for a better setup. So use my guide instead.

I got the above solution working and I love it; later I'm going to try another AWS solution, [GeForce CloudXR server](https://aws.amazon.com/blogs/architecture/field-notes-streaming-vr-to-wireless-headsets-using-nvidia-cloudxr/). Even more techie, it requires developer accounts for Nvidia, Oculus, and some manual PC->Quest USB file installations. But it might be even faster for streaming.

## Non-tech people

Notes for first-timers to Git, AWS, etc. Follow below if this isn't obvious stuff to you.

### Git

[Download VSCode](https://code.visualstudio.com/). Create a new project from Github, use \`https://github.com/ocdevel/diy-cloud-gaming.git\`. I think VSCode will handle all the Git stuff for you so you don't need to learn anything.

If not, [follow these docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) (and let me know so I can update this section).

### AWS

Setup [AWS](https://aws.amazon.com/). 

1. Create account, enter credit card, etc. [Activate MFA](https://docs.aws.amazon.com/accounts/latest/reference/root-user-mfa.html) on the root account! If this account gets hacked, crypto miners will drain your bank account. Trust me, it's really serious. 
1. [Create a new IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) inside AWS, never use your root account for development stuff. Call it \`admin\` or whatever. Give it \`AdministratorAccess\`. Probably wanna add MFA to this guy too.
1. Inside VSCode's Terminal, install [aws-cli](https://aws.amazon.com/cli/). [Generate access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) for your \`admin\` user. Copy those permissions in to \`aws configure\`. 
1. If someone can figure out the minimal permissions needed for deploying this Terraform project (aka, \`AdministratorAccess\` is too elevated - that's insecure), please let me know in a Github ticket.

## NiceDCV woes

[NiceDCV](https://download.nice-dcv.com/) a remote desktop protocol for high-performance computing (eg gaming), built by AWS. It's a "competitor" to Parsec, and I recommend the latter for your actual gaming, because DCV has *lots* of bugs. I find the mouse is a pain to work with. They have "relative mouse position" option in DCV, but I can't get it working. The display resolution never sticks, so you'll often find yourself scrolling the app window side/bottom bars to access Windows features.

Unfortunately you're stuck with DCV until you get everything setup, because Oculus looks for Remote Desktop and refuses to install if you're using it (to prevent projects like this). So use DCV just for setup, then Virtual Desktop or Parsec for actual gaming.

## IE Enhanced Security

Windows Server comes with IE Enahanced Security turned on by default. This prevents you from literally using Internet Explorer in any way shape or form. The moment you Google something, good luck even closing the window - it's insane.

Well we're not gonna even use IE anyway, except to download Chrome so we can download other things (Steam, Parsec, Oculus, etc). So we want to tell Windows to let us into IE, so we can download Chrome, and we'll never look at IE again. For that reason, don't worry about the fact you're disabling enhanced security. Hell, you can turn it back on after you get things setup if you care.

## AWS Gotchas

### G/V Instances

AWS limits new accounts' available EC2 instance types. In our case we want \`g5.2xlarge\`. If you've been using AWS for a while, you're probably fine. If you signed up for AWS just for this, you won't be able to use this project until you've hopped on a call with AWS and begged them to let you use \`G/V Instance\`.

**On Demand Instances**
1. Log into [AWS Console](https://console.aws.amazon.com/).
1. Seach or "Service Quotas". Make sure you're in the region you'll be running your PC! Top-right will say \`N. Virginia\` or something, click it and select your region (eg I'm \`us-west-2\`)
1. "Amazon Elastic Compute Cloud (Amazon EC2)"
1. Search for "Running On-Demand G and VT instances"
1. "Request quota increase"
1. Enter \`1\` if you only want this for yourself, or another number if you might take snapshots and share accounts with friends. Keep this low though, \`1\` is the most likely to get you approved!
1. If sales contacts you and asks what you want, tell them \`g5.2xlarge\` in \`your-region\`

If you want the above, but cheaper, there's something called Spot Instances. These let you "borrow" an instance that's not being used like it should, for as low as 10% of the On Demand price. BUT, if that person comes back to reclaim their instance, you get booted out. It's like couch-surfing / house-sitting at someone's mansion, and they may boot you if their business trip ended early. Risky for gaming, but it's actually kind of rare and well worth the price IMO. But you'll need to request Spot Instance Quota Increase, similar to the above steps for On Demand instances. 

**Spot Instances**
1. Seach or "Service Quotas". Make sure you're in the region you'll be running your PC! Top-right will say \`N. Virginia\` or something, click it and select your region (eg I'm \`us-west-2\`)
1. "Amazon Elastic Compute Cloud (Amazon EC2)"
1. "All G and VT Spot Instance Requests"
1. You know the rest.

### EBS Costs

Even though you're not charged for stopped EC2 instances, you *are* charged for the disk (EBS) that saves the files. I was charged $3/day for 512GB, if I recall. I need to get something setup so you can take an AMI snapshot and restore from that snapshot in the future. It would take longer to boot up / shut down, but it could save lots of money.
`

export default function Notes() {
  return <ReactMarkdown children={content} />
}