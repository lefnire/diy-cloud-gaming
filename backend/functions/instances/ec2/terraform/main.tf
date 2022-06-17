# Nothing much to see here. Modify variables.tf; or better yet, create a .tfvars file
# See https://www.terraform.io/language/values/variables

provider "aws" {
  region  = var.region
}

locals {
  tags = {
    Name = var.namespace
  }
}