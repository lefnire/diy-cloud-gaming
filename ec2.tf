data "aws_ami" "nice_dcv" {
  owners = ["amazon"]
  most_recent = true
  
  filter {
    name   = "name"
    #values = ["ami-062126a20ad482e57"]
    values = ["DCV-Windows-*-NVIDIA-gaming-*"]
  }
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
  tags = local.tags
}

module "ec2" {
  count = var.state == "init" ? 1 : 0

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

  tags = local.tags
}

resource "aws_eip" "eip" {
  count = var.state == "init" ? 1 : 0

  instance = module.ec2[0].id
  vpc      = true
  tags = local.tags
}


