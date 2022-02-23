variable "namespace" {
  type = string
  default = "diy-cloud-gaming"
}

variable "region" {
  type = string
  default = "us-west-2"
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

variable "my_ip" {
  type = string
}

variable "tags" {
  type = any
  default = {}
}
