# azure의 terraform

Hashicorp Terraform은 클라우드 인프라 프로비전하고 관리하기 위한 오픈소스 도구입니다. 클라우드 리소스의 토폴로지를 설명하는 구성 파일의 인프라를 체계화합니다. 이러한 리소스에는 가상 머신, 스토리지 계정 및 네트워크 인터페이스가 포함됩니다. Terraform CLI는 Azure에 구성 파일을 배포하고 버전을 지정하는 간단한 메커니즘을 제공합니다.

## 인프라 관리 자동화

Terraform의 템플릿 기반 구성 파일을 사용하면 반복 가능하고 예측 가능한 방식으로 Azure 리소스를 정의하고, 프로비전하고 구성할 수 있습니다.

- 인프라를 배포하고 관리하는 동안 사람의 실수 가능성을 줄입니다.
- 동일한 템플릿을 여러 번 배포하여 동일한 개발, 테스트 및 프로덕션 환경을 만듭니다.
- 개발 및 테스트 환경을 요청 시 만들어서 비용을 줄입니다.

## Terraform - Azure Cloud Shell 시작

- 환경 구성
  - azure 구독

- azure login
```
$az login
```

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
    "name": "sh_kwak@~bigdata~soft.com",
    "type": "user"
  }
}
```

나중에 마저 하기

https://docs.microsoft.com/ko-kr/azure/developer/terraform/getting-started-cloud-shell#specify-the-current-azure-subscription


## ref 
- https://docs.microsoft.com/ko-kr/azure/developer/terraform/overview
