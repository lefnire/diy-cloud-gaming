locals {
  name = "diy-cloud-gaming"
  region = "us-west-2"
  main_az = "us-west-2a"
  tags = {
    app = local.name
    Name = local.name
  }

  tcp = 6
  udp = 17
  myip = "${chomp(data.http.myip.body)}/32"
}

provider "aws" {
  region  = "us-east-1"

  # Make it faster by skipping some things
  skip_get_ec2_platforms      = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_credentials_validation = true

  # skip_requesting_account_id should be disabled to generate valid ARN in apigatewayv2_api_execution_arn
  skip_requesting_account_id = false
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

output "image-id" {
  value = data.aws_ami.nice_dcv.id
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"

  name = local.name
  cidr = "10.97.0.0/18"

  azs              = ["${local.region}a", "${local.region}b", "${local.region}c"]
  public_subnets   = ["10.97.0.0/24", "10.97.1.0/24", "10.97.2.0/24"]

  tags = local.tags
}

module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  name        = local.name
  description = "Gaming security group (NICE DCV, Remote Desktop, etc)"
  vpc_id      = module.vpc.vpc_id

  egress_rules        = ["all-all"]

  ingress_with_cidr_blocks = [
    {
      rule        = "ssh-tcp"
      cidr_blocks = local.myip
    },
    {
      rule        = "rdp-tcp"
      cidr_blocks = local.myip
    },
    {
      from_port   = 38810
      to_port     = 38840
      protocol    = local.udp
      description = "Virtual Desktop VR"
      cidr_blocks = local.myip
    },
    {
      from_port   = 38810
      to_port     = 38840
      protocol    = local.tcp
      description = "Virtual Desktop VR"
      cidr_blocks = local.myip
    },
    {
      from_port   = 8443
      to_port     = 8443
      protocol    = local.udp
      description = "NiceDCV QUIC"
      cidr_blocks = local.myip
    },
    {
      from_port   = 8443
      to_port     = 8443
      protocol    = local.tcp
      description = "NiceDCV QUIC"
      cidr_blocks = local.myip
    },
  ]

  tags = local.tags
}

module "ec2_instance" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 3.0"

  name = local.name

  ami                    = aws_ami.nice_dcv.id
  instance_type          = "t2.large"
  key_name = "aws-general"
  availability_zone           = local.main_az
  subnet_id                   = element(module.vpc.public_subnets, 0)
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  associate_public_ip_address = true
  get_password_data     =   "true"

  connection {
    password            =   "${rsadecrypt(self.password_data)}"
  }


  tags = local.tags
}

resource "aws_eip" "eip" {
  instance = module.ec2_instance.id
  vpc      = true
}

output "nice_dcv_connection_stuff" {
  value = <<-EOF
  IP: ${aws_eip.eip.public_ip}
  Username: Administrator
  Password: ${rsadecrypt(module.ec2_instance.password_data,file("/path/to/private_key.pem"))}
  EOF
}
