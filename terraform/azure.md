# azure의 terraform

Hashicorp Terraform은 클라우드 인프라 프로비전하고 관리하기 위한 오픈소스 도구입니다. 클라우드 리소스의 토폴로지를 설명하는 구성 파일의 인프라를 체계화합니다. 이러한 리소스에는 가상 머신, 스토리지 계정 및 네트워크 인터페이스가 포함됩니다. Terraform CLI는 Azure에 구성 파일을 배포하고 버전을 지정하는 간단한 메커니즘을 제공합니다.

## 인프라 관리 자동화

Terraform의 템플릿 기반 구성 파일을 사용하면 반복 가능하고 예측 가능한 방식으로 Azure 리소스를 정의하고, 프로비전하고 구성할 수 있습니다.

- 인프라를 배포하고 관리하는 동안 사람의 실수 가능성을 줄입니다.
- 동일한 템플릿을 여러 번 배포하여 동일한 개발, 테스트 및 프로덕션 환경을 만듭니다.
- 개발 및 테스트 환경을 요청 시 만들어서 비용을 줄입니다.

## 적용하기 전 인프라 변경 내용 이해

리소스 토폴로지가 복잡해지면서 인프라 변경의 의미와 영향을 이해하는 것이 어려울 수 있음

Terraform CLI를 통해 사용자는 애플리케이션 전에 인프라 변경 내용을 확인하고 미리 볼 수 있다. 
다음과 같은 여러가지 이점이 있다.

- 제안된 변경 사항과 그 영향을 팀 멤버가 신속하기 이해하기 때문에 보다 효과적으로 협업할 수 있다.
- 의도하지 않은 변경을 개발 프로세스 초기에 파악할 수 있다.

## Terraform - Azure Cloud Shell 시작

- 환경 구성
  - azure 구독

- azure login
```
$az login
````

- 구독 정보 확인

```
 $az account show
{
  "environmentName": "AzureCloud",
  "isDefault": true,
  "managedByTenants": [
    {
    }
  ],
  "state": "Enabled",
  "user": {
    "name": "sh_kwak@~~soft.com",
    "type": "user"
  }
}
```

- 기본 Terraform 구성 파일 만들기

```

provider "azurerm" {
  version = "~>2.0"
  features {}
}

resorce "azurerm_resource_group" "rg" {
  name = "<your_resource_group_name>"
  location = "<your_resource_group_location>"
} 
```

- `version` 특성은 선택 사항이지만 HashiCorp에서는 지정된 버전의 공급자로 고정할 것을 권장
- Azure 공급자 1.x를 사용 중인 경우 `features` 블록을 사용할 수 없음
- Azure 공급자 2.x를 사용 중인 경우 `features` 블록이 필요하다.


## Terraform 실행 계획 만들기 및 적용

1. Terraform 배포 초기화

```
$ terraform init
```

2. terraform plan을 실행하여 실행 계획을 만듬

```
$ terraform plan -out <terraform_plan>.tfplan
```

## Terraform 실행 계획 되돌리기

```
$ terraform apply <terraform_plan>.destroy.tfplan

or
$ terraform plan -destroy -out <terraform_plan>.destroy.tfplan
```

- `terraform plan` 명령은 실행 계획을 만들지만 실행하지는 않는다. 대신 구성 파일에 지정된 구성을 만드는 데 필요한 작업을 결정한다. 이 패턴을 사용하면 실제 리소스를 변경하기 전에 실행 계획이 예상과 일치하는지 확인할 수 있다.

- 선택사항인 `-out` 매개변수를 사용하여 계획의 출력파일을 지정할 수 있다. `-out` 매개 변수를 사용하면 검토한 계획인 정확하게 적용된다.

## Terraform을 사용하여 Azure에서 인프라를 갖춘 Linux VM 만들기

`provider` 섹션은 Azure 공급자를 사용하도록 Terraform에 알린다.

다음 섹션에서 `eastus` 위치에 `myResourceGroup`이라는 리소스 그룹을 만든다.

```

```


## ref 
- https://docs.microsoft.com/ko-kr/azure/developer/terraform/getting-started-cloud-shell#specify-the-current-azure-subscription
- https://docs.microsoft.com/ko-kr/azure/developer/terraform/overview
- https://docs.microsoft.com/ko-kr/azure/developer/terraform/create-linux-virtual-machine-with-infrastructure