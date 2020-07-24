# Terraform - AWS

아마존 웹 서비스 계정에서 테라폼을 원할하게 사용하기 위해서는 발급받은 IAM 사용자의 권한 자격 정보 즉, AWS_ACCESS_KEY와 AWS_SECRET_ACCESS_KEY의 설정을 해야한다.

> export AWS_ACCESS_KEY_ID={access key 값}
> export AWS_SECRET_ACCESS_KEY={secret key 값}

- AMI
AMI(Amazon Machine Image)는 EC2 인스턴스를 구동시키는 골드 이미지이다.
예제의 ami-40d28157은 us-east-1의 ubuntu 16.04 값이다.


example) main.ft
```
provider "aws" {
    region = "us-east-1"
}

resource "aws_instance" "example" {
    ami             = "ami-40d28157"
    instance_type   = "t2.micro"
}
```

- VPN

VPN은 한국어로 "가상사설망"이라고 한다. 앞에 "가상"이라는 단어에서 알 수 있듯 실제 사설망이 아닌 가상의 사설망이다. 물리적으로 네트워크를 분리하기 어려울때 가상의 망 VPN을 사용하게 된다.

VPN은 같은 네트워크상에 있는 것을 논리적으로 다른 네트워크에서 동작하게끔 만든다.

- VPC(Virtual Private Cloud)

VPC가 없다면 EC2 인스턴스들이 서로 거미줄처럼 연결되고 인터넷과 연결된다. 이런 구조는 시스템의 복잡도를 엄청나게 끌어올릴뿐만 아니라 하나의 인스턴스만 추가되도 모든 인스턴스를 수정해야하는 불편함이 생긴다.







## ref
- https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code
- Terraform UP & Running 발췌
- https://medium.com/harrythegreat/aws-%EA%B0%80%EC%9E%A5%EC%89%BD%EA%B2%8C-vpc-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-71eef95a7098