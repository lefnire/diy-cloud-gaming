This terraform module provisions a gaming PC in AWS. You can then use that for cloud-gaming, both traditional or VR (Quest 2). Original blog post [here](https://aws.amazon.com/blogs/gametech/enabling-quest-2-ar-vr-on-ec2-with-nice-dcv/)

## On localhost (Mac, PC, whatever)

1. Setup [AWS](https://aws.amazon.com/). Install [aws-cli](https://aws.amazon.com/cli/). Create an IAM user with admin permissions. Copy those permissions in to `aws configure`. 
1. Install [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli?in=terraform/aws-get-started). Edit terraform-example/main.tf with any edits you want. There's more documentation in that file.
1. `cd terraform-example; terraform apply`. Review the modifications, `yes`. This will take a long time because it's waiting for infrastructure > EC2 instance > boot up > password available for decrypt.

It will output your login credentials to your new Windows PC. Download [Nice DCV](https://download.nice-dcv.com/) client. Connection Settings > Protocol > QUIC (8443) > Apply. Enter the connection info outputed from Terraform in terminal (IP, Administrator, Password).

## On Windows Server (through DCV Viewer)

Enable "Wireless LAN Service" as outlined [in post](https://aws.amazon.com/blogs/gametech/enabling-quest-2-ar-vr-on-ec2-with-nice-dcv/)

1. Server Manager → Add roles and features
1. Click through until you get to Features, and select the Wireless LAN Service feature
1. Click Next to move to the end to install the feature
1. Reboot the EC2 instance in order to complete the installation of the new feature

Download everything; eg Chrome, Steam, etc. 

## Traditional gaming

You can play games directly through Nice DCV Viewer. I find the mouse is a pain to work with. They have "relative mouse position" option in DCV, but I can't get it working. So instead, I recommend using Steam Remote Play. This sets Steam up on Windows as a server, then you can download the Steam Remote Play client to any of your devices (Mac, PC, web, mobile, etc). Then play from there.

## VR

* Download / install [Oculus](https://www.oculus.com/setup/). Logging in through Facebook is really hard in this setup, Facebook detects malicious. It puts you through an account-verify infinite loop, and will lock you out if you try that loop too much. I recommend: in Chrome, do a reset-password on Facebook. Go through the password-completion steps *on Windows Server*, not localhost (though you may need to verify some stuff on localhost). 
* Steam. Install, then inside Steam install SteamVR. 
* [Virtual Desktop Streamer App](https://www.vrdesktop.net/). Not VD from Steam library, use this website.
  * On Quest, buy/install Virtual Desktop. It's like $10.
  * Run VD Streamer on Windows, connect to it from Quest.

## When you're done

See the output from Terraform terminal, it gives a command to stop your instance. That way you're not paying for the instance when you're not using it (free when it's shut-down). Or you can stop the instance inside Windows Server (Start > Shut Down).

## Without Terraform

If you don't have a computer to do this from, you can do it all through mobile / whatever. I'll write instructions later, but I recommend looking through the Terraform files and the original blog post to mind-translate the code steps to manual console.aws.com steps. It'll be much harder in console, Terraform strings things together that's not explicit in the code files (eg, Internet Gateway, Route Tables, etc); so if you can use Terraform, please do.
