function findNiceDCVAMI() {

}

function createKeyPair() {

}

function createEip() {

}

function createEc2(form) {
  const ami = findNiceDCVAMI()
  ec2client.createServer({
    ami,
    instanceType: form.instanceType
  })

}

export function createServer(form, vpc) {

}