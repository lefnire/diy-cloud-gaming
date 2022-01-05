variable "namespace" {
  type = string
  default = "diy-cloud-gaming"
}

variable "tags" {
  type = any
  default = {}
}

variable "region" {
  type = string
  default = "us-west-2"
}

variable "key_name" {
  type = string
}
variable "pem_file" {
  type = string
}

variable "instance_type" {
  type = string
  default = "g5.2xlarge"
}

variable "spot_price" {
  type = string
  default = null
}

variable "volume_size" {
  type = number
  default = 1000
}

variable "volume_type" {
  type = string
  default = "gp3"
}