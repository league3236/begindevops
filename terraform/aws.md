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



## ref
- https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code
- Terraform UP & Running 발췌