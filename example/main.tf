locals {
  region = "us-west-2"
  namespace = "diy-cloud-gaming"
  tags = {
    Name = local.namespace
  }
}

data "http" "my_ip" {
  url = "http://ipv4.icanhazip.com"
}

provider "aws" {
  region  = local.region
}

module "diy-gaming" {
  source = "../terraform"

  # Security groups are only opened for the IP address of the computer you're running `apply` from. You can change this below,
  # or what I do is just update the SG in AWS console if I move to a different location.
  my_ip = "${chomp(data.http.my_ip.body)}/32"

  # Namespace & tags will help you identify your resources later (know what to 
  # terminate, observe AWS costs by this service, etc)
  namespace = local.namespace

  # Where to launch your VPC & instance. Make sure it's the on closest too you!
  region = local.region

  # g4dn.2xlarge for cheaper (about $.70/h); g5.2xlarge for stronger (about $1.4/h). 
  # See https://aws.amazon.com/ec2/pricing/on-demand/. *.xlarge for 4vcpu/16gb RAM; 
  # *.2xlarge for 8vcpu/32gb RAM. IMO, 2xlarge is the sweet spot; less is too 
  # little, more is too much.
  instance_type = "g5.2xlarge"
  volume_size = 1000
  volume_type = "gp3"

  # If spot_price is null, it will create an on-demand EC2 instance. This is 
  # more expensive, but more stable. Spot instances can save you up to 90% 
  # on-demand prices; but they can be pulled out from under you (killing 
  # your gaming session). It's a bidding model, the higher your bid, the more 
  # likely you are to keep your instance online. I suggest setting the price higher 
  # than the price of the on-demand instance ($2 instead of $1.5 in this case). 
  # So MOST of the time you'll be at the cost-saving; but when demand is pushing 
  # you, your high-bid is likely to keep you online. Set this to null (or don't 
  # include it) if you don't ever want a gaming session killed; and you're willing 
  # to pay a premium for that. Set it to a number if you're willing to have 
  # sessions killed, with the benefit of $$$ savings.

  # Note: you might need to request a Spot Instance quota increase (from 0 to 1); 
  # EC2 disables Spot Requests by default in some cases. Go to AWS > <search for 
  # "service quotas" > EC2. Create a request for "All G and VT Spot Instance Requests"
  # setting "new request" from 0 to 1. They grant this manually, so it could take some
  # days. If you want to get started, set below to `null` and do the Spot thing later.
  spot_price = null
  #spot_price = "2.0"

  tags = local.tags
}

output "connection-info" {
  value = module.diy-gaming.connection-info
}