
## ref
- https://bcho.tistory.com/1291


# 쿠버네티스 리소스(CPU/Memory) 할당과 관리

## 리소스 관리

쿠버네티스에서 Pod를 어느 노드에 배포할지를 결정하는 것을 스케줄링이라고 한다.
Pod에 대한 스케줄링시에, Pod 내의 애플리케이션이 동작할 수 있는 충분한 자원(CPU, 메모리 등)이 확보되어야 한다. 쿠버네티스 입장에서는 애플리케이션에서 필요한 자원의 양을 알아야, 그 만한 자원이 가용한 노드에 Pod를 배포할 수 있다.

쿠버네티스에서는 이런 컨셉을 지원하기 위해서 컨테이너에 필요한 리소스의 양을 명시할 수 있도록 지원하고 있다. 현재(1.9 버전) 지원되는 리소스 타입은 CPU와 메모리이며, 아직까지 네트워크 대역폭이나 다른 리소스 타입은 지원하고 있지 않다.

## 리소스 단위

리소스를 정의하는데 사용되는 단위는 CPU의 경우에는 ms(밀리 세컨드)를 사용한다. 해당 컨테이너에 얼마만큼의 CPU 자원을 할당할 것인가인데, 대략 1000ms가 1vCore(가상 CPU 코어) 정도가 된다. 클라우드 벤더에 따라 또는 쿠버네티스를 운영하는 인프라에 따라서 약간씩 차이가 있으니 참고해야한다.
메모리의 경우는 Mb를 사용한다.

## Request & Limit

컨테이너에 적용될 리소스의 양을 정의하는데 쿠버네티스에서는 request와 limit이라는 컨셉을 사용한다. request는 컨테이너가 생성될때 요청하는 리소스 양이고, limit은 컨테이너가 생성된 후에 실행되다가 리소스가 더 필요한 경우 (CPU가 메모리가 더 필요한 경우) 추가로 더 사용할 수 있는 부분이다.

예를 들어 CPU request를 500ms로 하고, limit을 1000ms로 하면 해당 컨테이너는 처음에 생성될때 500ms를 사용할 수 잇다. 그런데, 시스템 성능에 의해서 더 필요하다면 CPU가 추가로 더 할당되어 최대 1000ms까지 할당될 수 있다.

리소스를 정의하는 방법은 아래와 같이 Pod spec 부분에서 개별 컨테이너 마다. Resources 파트에 request와 limit으로 필요한 리소스의 최소/최대양을 정의하면 된다.

```
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: wp
    image: wordpress
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

db라는 이름과 wp라는 이름의 컨테이너는 생성시 250ms 만큼의 cpu 리소스를 사용할 수 있도록 생성이 되고, 필요시 최대 CPU를 500ms 까지 늘려서 사용할 수 있다.

## 모니터링 리소스

그러면 사용할 수 있는 리소스의 양과 현재 사용되고 있는 리소스의 양을 어떻게 모니터링할 수 있을까?
사용할 수 있는 리소스의 양은 쿠버네티스 클러스터를 생성하는데 사용된 node의 스펙을 보면 알 수 있다. 예를 들어 2코어 VM5대로 node를 만들었다면 그 총량은 10 코어 = 10,000ms가 된다.

그러나 이 자원을 모두 사용자 애플리케이션에 사용할 수 있는 것이아니라. 쿠버네티스 클러스터를 유지하는 시스템 자원이나 또는 모니터링 등에 자원이 소비되기 때문에 실제로 사용할 수 있는 자원의 양을 확인하는게 좋은데 `kubectl describe nodes` 명령을 이용하면 된다.
아래 예제는 kubectl describe nodes 명령으로 node들의 상세정보중에서 한 node의 자원 상태를 모니터링한 내용이다.

Pod들의 리소스 사용량은 `kubectl tep pods` 명령으로 확인이 가능하다.

## ResourceQuota & LimitRange

이제까지 컨테이너 운영에 필요한 리소스의 양을 명시하여 요청하는 방법을 알아보았다.
만약에 어떤 개발자나 팀이 불필요하게 많은 리소스를 요청한다면, 쿠버네티스 클러스터를 운영하는 입장에서 자원이 낭비가 되고, 다른 팀이 피해를 볼 수 있는 상황이 될 수 있다. 그래서, 쿠버네티스에서는 네임스페이스별로 사용할 수 있는 리소스의 양을 정하고, 컨테이너마다 사용할 수 있는 리소스의 양을 지정할 수 있는 기능을 제공한다.

### Resource Quota

Resource Quota는 네임스페이스별로 사용할 수 있는 리소스의 양을 정한다. 
아래의 예는 demo 네임스페이스에, cpu는 500m ~ 700m 까지, 메모리는 100M ~ 500M 까지 할당한 에제이다.

```
apiVersion: v1
kind: ResourceQuota
metadata:
  name: demo
spec:
  hard:
    requests.cpu: 500m
    requests.memory: 100Mib
    limits.cpu: 700m
    limits.memory: 500Mib
```

이 용량안에서 demo 네임스페이스내에 컨테이너를 자유롭게 만들어서 사용할 수 있다.

## Limit Range

Resource Quota가 네임 스페이스 전체의 리소스양을 정의한다면, Limit Range는 컨테이너 개별 자원의 사용 가능 범위를 지정한다.

```
apiVersion: v1
kind: LimitRange
metadata:
  name: demo
spec:
  limits:
- default:
    cpu: 600m
    memory: 100Mib
  defaultRequest:
    cpu: 100m
    memory: 50Mib
  max:
    cpu: 1000m
    memory: 200Mib
  min:
    cpu: 10m
    memory: 10Mib
  type: Container
```

- default로 정의된 부분은 컨테이너에 limit을 지정하지 않았을 경우 디폴트로 지정되는 limit이다. 여기서는 cpu 600m, 메모리 100m 정의되었다.

- defaultRequest로 정의된 부분은 컨테이너의 request를 지정하지 않았을 경우 디폴트로 지정되는 request의 양이다.

- max : 컨테이너에 limit을 지정할 경우, 지정할 수 있는 최대의 크기이다.
- min : 컨테이너에 limit을 지정할 경우, 지정할 수 있는 최소의 크기이다.

### Overcommitted 상태

request와 limit의 개념이 있기 때문에 생기는 문제인데, request 된 양에 따라서 컨테이너를 만들었다고 하더라도, 컨테이너가 운영이 되다가 자원이 모자르면 limit에 정의된 양까지 계속해서 리소스를 요청하게 된다.

컨테이너의 총 limit의 양이 실제 시스템이 가용한 resource의 양보다 많을 수 있는 경우가 발생한다. 이를 overcommitted 상태라고 한다. 

Overcommitted 상태가 발생하면, CPU의 경우에는 실제 사용량을 requestd에 정의된상태까지 낮춘다. 예를들어 limit이 500, request가 100인 경우, 현재 500으로 가동되고 있는 컨테이너의 cpu할당량을 100으로 낮춘다. 그래도 Overcommitted 상태가 해결되지 않은 경우, 우선 순위에 따라서 운영중인 컨테이너를 강제 종료시킨다.

메모리의 경우 할당되어 사용중인 메모리 크기를 줄일 수는 없기 대문에, 우선 순위에 따라서 운영중인 컨테이너를 강제종료시킨다. Deployment, RS/RC에 의해 관리되고 있는 컨테이너는 다시 리스타트가 되고 초기 requested 상태의 만큼만 자원 (메모리/CPU)를 요청해서 사용하기 때문에,  Overcommitted 상태가 해제된다.

Best Practice
구글 문서에 따르면 데이터베이스등 아주 무거운 애플리케이션이 아니면, 일반적인 경우에는 CPU request를 100m 이하로 사용하기를 권장한다.



