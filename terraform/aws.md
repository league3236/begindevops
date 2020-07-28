# Terraform - AWS

아마존 웹 서비스 계정에서 테라폼을 원할하게 사용하기 위해서는 발급받은 IAM 사용자의 권한 자격 정보 즉, AWS_ACCESS_KEY와 AWS_SECRET_ACCESS_KEY의 설정을 해야한다.

> export AWS_ACCESS_KEY_ID={access key 값}
> export AWS_SECRET_ACCESS_KEY={secret key 값}

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
- AMI
AMI(Amazon Machine Image)는 EC2 인스턴스를 구동시키는 골드 이미지이다.
예제의 ami-40d28157은 us-east-1의 ubuntu 16.04 값이다.

- instance_type
ec2 인스턴스 타입은 각기 다른 cpu, 메모리, 디스크 용량, 네트워크 수용량을 가지고 있는데 t2.micro에 따른 자원 량을 지정한다.

- Init
Init 명령어는 테라폼을 수행하기 위한 provider의 플러그인들을 초기 설정하는 명령어이다. 
```
$ terraform init
```

- Plan
plan 명령어는 테라폼을 통해 실제로 생성되고 변경되는 내역을 보여준다.
실제 환경에 적용하기 전에 검증할 수 있게 하는 수단이다.
```
$ terraform plan
```

- apply
.tf 파일에 따라 실제로 인스턴스를 생성한다.
```
$ terraform apply
```

- VPN(Virtual Private Network)

VPN은 한국어로 "가상사설망"이라고 한다.
"가상"이라는 단어에서 알 수 있듯 실제 사설망이 아닌 **가상의 사설망이다.** 보안상의 이유로 직원간 네트워크를 분리하고 싶다면 기존 인터넷선 선공사도 다시해야하고 건물의 내부선을 뜯어고쳐야하며 다시 전용선을 깔아야 하는데, 이를 위해 가상의 망 VPN을 사용하게 된다.

## ref
- https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code
- 도서 Terraform UP & Running 발췌
- https://medium.com/harrythegreat/aws-%EA%B0%80%EC%9E%A5%EC%89%BD%EA%B2%8C-vpc-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-71eef95a7098