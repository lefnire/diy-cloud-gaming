output "nice-dcv-image-id" {
  value = data.aws_ami.nice_dcv.id
}

output "connection-info" {
  value = <<-EOF
  IP: ${aws_eip.eip.public_ip}
  Username: Administrator
  Password: ${rsadecrypt(module.ec2.password_data,file(var.pem_file))}

  Later, when you're done gaming, run:
  aws ec2 stop-instances --instance-ids ${module.ec2.id}

  And when you wanna play again, run:
  aws ec2 start-instances --instance-ids ${module.ec2.id}
  EOF
}