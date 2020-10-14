# terraform

- provisioning

어떤 프로세스나 서비스를 실행하기 위한 준비 단계를 프로비저닝이라고 이야기합니다. 프로비저닝에는 크게 네트워크나 컴퓨팅 자원을 준비하는 작업과 준비된 컴퓨팅 자원에 사이트 패키지나 애플리케이션 의존성을 준비하는 단계로 나뉘어집니다. 명확한 경계는 불분명하지만 테라폼은 전자를 주로 다루는 도구입니다.

- provider

테라폼과 외부 서비스를 연결해주는 기능을 하는 모듈입니다. 예를 들어 테라폼으로 aws 서비스의 컴퓨팅 자원을 생성하기 위해서 aws 프로바이더를 먼저 셋업해야합니다. 프로바이더로는 aws, 구글 클라우드 플랫폼, 마이크로소프트 애져와 같은 범용 클라우드를 비롯해 깃허브, 데이터도구, DNSimple과 같은 특정 기능을 제공하는 서비스, MySQL, 레빗MQ, 도커와 같은 로컬 서비스등을 지원합니다. 전체 목록은 테라폼 프로바이더 문서에서 찾을 수 있습니다.

- 리소스(자원)

리소스란 특정 프로바이더가 제공해주는 조작 가능한 대상의 최소 단위입니다. 예를 들어 AWS 프로바이더는 aws_instance 리소스 타입을 사용해 Amazon EC2의 가상 머신 리소스를 선언하고 조작하는 것이 가능합니다. EC2 인스턴스, 시큐리티 그룹, 키 페어 모두 aws 프로바이더가 제공해주는 리소스 타입입니다.

- HCL(Hashicorp Configuration Language)

HCL은 테라폼에서 사용하는 설정 언어입니다. 테라폼에서 모든 설정과 리소스 선언은 HCL을 사용해 이루어집니다. 테라폼에서 HCL 파일의 확장자는 .tf를 사용합니다.

- Plan

테라폼 프로젝트 디렉터리 아래의 모든 .tf 파일의 내용을 실제로 적용 가능한지 확인하는 작업을 계획이라고 합니다. 테라폼은 이를 terraform plan 명령어로 제공하며, 이 명령어를 실행하면 어던 리소스가 생성되고, 수정되고, 삭제될지 계획을 보여줍니다.

- Apply

테라폼 프로젝트 디렉터리 아래의 모든 .tf 파일의 내용대로 리소스를 생성, 수정, 삭제하는 일을 apply라고 합니다. 테라폼은 이를 terraform apply 명령어로 제공합니다. 이 명령어를 실행하기 전에 변경 예정 사항은 plan 명령어를 사용해 확인 할 수 있습니다. 적용하기 전에도 plan의 결과를 보여줍니다.




## terraform 설치

- 맥 os
```
$brew install terraform
```

## 사용법

- 버전 체크

```
$terraform version
```

- 환경변수 (aws)

```
$export AWS_ACCESS_KEY_ID={액세스키 id}
$export AWS_SECRET_ACCESS_KEY={비밀 액세스 키}
```

- 기본적인 테라폼 리소스의 문법

PROVIDER는 아마존 웹 서비스 처럼 공급자의 이름, TYPE은 instance와 같이 생성하고자 하는 리소스의 종류, NAME은 테라폼에서 해당 리소스를 지칭하는 식별자, CONFIG는 해당 리소스에 선언할 수 있는 하나 이상의 설정 변숫값들로 구성되어있다.

```
resource "PROVIDER_TYPE" "NAME" {
    [CONFIG...]
}
```

- init

테라폼을 수행하기 위한 공급자의 플러그인들을 초기 설정하는 명령어
예를 들어, 아마존 웹 서비스의 최신 버전 플로그인 들이 설정된다.

```
$terraform init
```


- plan 명령을 통한 변경 사항 미리 체크

```
$terraform plan
```

- 적용 (main.tf)

```
$terraform apply
```

### ref
- https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code
