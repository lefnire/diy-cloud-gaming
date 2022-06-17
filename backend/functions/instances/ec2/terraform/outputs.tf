output "nice-dcv-image-id" {
  value = data.aws_ami.nice_dcv.id
}

output "connection-info" {
  value = !(var.state == "init" && var.ami == "default") ? "" : <<-EOF
  IP: ${aws_eip.eip.public_ip}
  Username: Administrator
  Password: ${rsadecrypt(module.ec2[0].password_data,file("./${var.namespace}.pem"))}

  After you've setup your box, run:
  TF_VAR_state=snapshot terraform apply --auto-approve

  Later, when you're done gaming, run:
  TF_VAR_state=stop terraform apply --auto-approve

  And when you wanna play again, run:
  TF_VAR_state=start terraform apply --auto-approve
  EOF
}