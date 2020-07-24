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

VPC를 적용하면 위 그림과같이 VPC별로 네트워크를 구성할 수 있고 각각의 VPC에 따라 다르게 네트워크 설정을 줄 수 있다. 또한 각각의 VPC는 완전히 독립된 네트워크처럼 작동하게 된다.

- VPC를 구축하는 과정

VPC를 구축하기 위해서는 VPC의 아이피범위를 RFC1918이라는 사설 아이피 대역에 맞추어 구축해야한다. 사설IP란 무엇일까요? 내부적인 IP주소이다. 

VPC에서 사용하는 사설 아이피 대역은 아래와 같다.

- 10.0.0.0 ~ 10.255.255.255(10/8 prefix)
- 172.16.0.0 ~ 172.31.255.255(182.16/12 prefix)
- 192.168.0.0 ~ 192.168.255.255(192.168/16 prefix)

한번 설정된 아이피 대역은 수정할 수 없으며 각 VPC는 하나의 리전에 종속된다.
각각의 VPC는 완전히 독립적이기 때문에 만약 VPC간 통신을 원한다면 VPC 피어링 서비스를 고려해볼 수 있다.

- 서브넷

VPC를 만들었다면 서브넷을 만들 수 있다. 서브넷은 VPC를 잘개 쪼개는 과정이다. 서브넷은 VPC안에 있는 VPC보다 더 작은 단위이기 때문에 연히 서브넷마스크가 더 높게되고 아이피범위가 더 작은값을 갖게된다.
서브넷을 통해 나누는 이유는 더 많은 네트워크망을 만들기 위해서이다.








## ref
- https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code
- Terraform UP & Running 발췌
- https://medium.com/harrythegreat/aws-%EA%B0%80%EC%9E%A5%EC%89%BD%EA%B2%8C-vpc-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-71eef95a7098