output "nice-dcv-image-id" {
  value = data.aws_ami.nice_dcv.id
}

output "connection-info" {
  value = var.state != "init" ? "" : <<-EOF
  IP: ${aws_eip.eip[0].public_ip}
  Username: Administrator
  Password: ${rsadecrypt(module.ec2[0].password_data,file("./${var.namespace}.pem"))}

  Later, when you're done gaming, run:
  aws ec2 stop-instances --instance-ids ${module.ec2[0].id}

  And when you wanna play again, run:
  aws ec2 start-instances --instance-ids ${module.ec2[0].id}
  EOF
}