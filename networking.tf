data "aws_availability_zones" "available" {
  state = "available"
}

data "http" "my_ip" {
  url = "http://ipv4.icanhazip.com"
}

locals {
  tcp = 6
  udp = 17

  # Note, only one subnet (for that AZ) is created in this file. Should I add more, eg if you can't find capacity for your launched instance?
  az = element(data.aws_availability_zones.available.names, 0)

  ip_addresses = [for ip in var.ip_addresses : "${ip == "mine" ? chomp(data.http.my_ip.body) : ip}/32"]
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"

  name = var.namespace
  cidr = "10.97.0.0/18"

  azs              = [local.az]
  public_subnets   = ["10.97.0.0/24"]

  tags = local.tags
}

module "sg_ec2" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  name        = var.namespace
  description = "Gaming security group (NICE DCV, Remote Desktop, etc)"
  vpc_id      = module.vpc.vpc_id

  egress_rules        = ["all-all"]

  ingress_with_cidr_blocks = flatten([for ip in local.ip_addresses: [
    {
      rule        = "ssh-tcp"
      cidr_blocks = ip
    },
    {
      rule        = "rdp-tcp"
      cidr_blocks = ip
    },
    {
      from_port   = 38810
      to_port     = 38840
      protocol    = local.udp
      description = "Virtual Desktop VR"
      cidr_blocks = ip
    },
    {
      from_port   = 38810
      to_port     = 38840
      protocol    = local.tcp
      description = "Virtual Desktop VR"
      cidr_blocks = ip
    },
    {
      from_port   = 8443
      to_port     = 8443
      protocol    = local.udp
      description = "NiceDCV QUIC"
      cidr_blocks = ip
    },
    {
      from_port   = 8443
      to_port     = 8443
      protocol    = local.tcp
      description = "NiceDCV QUIC"
      cidr_blocks = ip
    },
    {
      from_port = 8000
      to_port = 8040
      protocol = local.udp
      description = "Parsec"
      cidr_blocks = ip
    }
  ]])

  tags = local.tags
}
