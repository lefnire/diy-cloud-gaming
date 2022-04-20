variable "state" {
  type    = string

  validation {
    condition     = contains(["networking", "init", "snapshot", "stop", "start"], var.state)
    error_message = "Allowed values for state are init|snapshot|down|up."
  }
}

variable "ami" {
  type = string
}

# Namespace & tags will help you identify your resources later (know what to
# terminate, observe AWS costs by this service, etc)
variable "namespace" {
  type = string
}

# Where to launch your VPC & instance. Make sure it's the on closest too you!
variable "region" {
  type = string
}

# Security groups are only opened for the IP address of the computer you're running `apply` from. You can change this below,
# or what I do is just update the SG in AWS console if I move to a different location.
# List of actual ip addresses, and "mine" will be tranformed ot your current router's IP.
variable "ip_addresses" {
  type = list(string)
}

# g4dn.2xlarge for cheaper (about $.70/h); g5.2xlarge for stronger (about $1.4/h).
  # See https://aws.amazon.com/ec2/pricing/on-demand/. *.xlarge for 4vcpu/16gb RAM;
  # *.2xlarge for 8vcpu/32gb RAM. IMO, 2xlarge is the sweet spot; less is too
  # little, more is too much.
variable "instance_type" {
  type = string
}

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
variable "spot_price" {
  type = string
}

variable "volume_size" {
  type = number
}

variable "volume_type" {
  type    = string
}