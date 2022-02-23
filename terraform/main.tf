data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  tcp = 6
  udp = 17

  # Note, only one subnet (for that AZ) is created in this file. Should I add more, eg if you can't find capacity for your launched instance?
  az = element(data.aws_availability_zones.available.names, 0)
}

data "aws_ami" "nice_dcv" {
  owners = ["amazon"]
  most_recent = true
  
  filter {
    name   = "name"
    #values = ["ami-062126a20ad482e57"]
    values = ["DCV-Windows-*-NVIDIA-gaming-*"]
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"

  name = var.namespace
  cidr = "10.97.0.0/18"

  azs              = [local.az]
  public_subnets   = ["10.97.0.0/24"]

  tags = var.tags
}

module "sg_my_ip" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  name        = var.namespace
  description = "Proxy: allow all traffic from local/mobile IP. Further restrictions in other SG. Makes updating IP later easier."
  vpc_id      = module.vpc.vpc_id

  egress_rules        = ["all-all"]
  ingress_with_cidr_blocks = [
    {
      rule        = "all-all"
      cidr_blocks = var.my_ip
    },
  ]

  tags = var.tags
}

module "sg_ec2" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  name        = var.namespace
  description = "Gaming security group (NICE DCV, Remote Desktop, etc)"
  vpc_id      = module.vpc.vpc_id

  egress_rules        = ["all-all"]

  ingress_with_cidr_blocks = [
    {
      rule        = "ssh-tcp"
      cidr_blocks = var.my_ip
    },
    {
      rule        = "rdp-tcp"
      cidr_blocks = var.my_ip
    },
    {
      from_port   = 38810
      to_port     = 38840
      protocol    = local.udp
      description = "Virtual Desktop VR"
      cidr_blocks = var.my_ip
    },
    {
      from_port   = 38810
      to_port     = 38840
      protocol    = local.tcp
      description = "Virtual Desktop VR"
      cidr_blocks = var.my_ip
    },
    {
      from_port   = 8443
      to_port     = 8443
      protocol    = local.udp
      description = "NiceDCV QUIC"
      cidr_blocks = var.my_ip
    },
    {
      from_port   = 8443
      to_port     = 8443
      protocol    = local.tcp
      description = "NiceDCV QUIC"
      cidr_blocks = var.my_ip
    },
    {
      from_port = 8000
      to_port = 8040
      protocol = local.udp
      description = "Parsec"
      cidr_blocks = var.my_ip
    }
  ]

  tags = var.tags
}

resource "tls_private_key" "key" {
  algorithm = "RSA"
}
resource "local_file" "private_key" {
  filename = "./${var.namespace}.pem"
  sensitive_content = tls_private_key.key.private_key_pem
  file_permission = "0400"
}
resource "aws_key_pair" "key_pair" {
  key_name = var.namespace
  public_key = tls_private_key.key.public_key_openssh
  tags = var.tags
}

module "ec2" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 3.0"

  name = var.namespace

  ami                    = data.aws_ami.nice_dcv.id
  instance_type          = var.instance_type
  key_name = aws_key_pair.key_pair.key_name
  availability_zone           = local.az
  subnet_id                   = element(module.vpc.public_subnets, 0)
  vpc_security_group_ids      = [module.sg_ec2.security_group_id]
  associate_public_ip_address = true
  get_password_data     =   true

  create_spot_instance = var.spot_price == null ? false : true
  spot_price = var.spot_price
  spot_instance_interruption_behavior	 = var.spot_price == null ? null : "stop"

  root_block_device = [
    {
      volume_type = var.volume_type
      volume_size = var.volume_size
    },
  ]

  tags = var.tags
}

resource "aws_eip" "eip" {
  instance = module.ec2.id
  vpc      = true
  tags = var.tags
}

