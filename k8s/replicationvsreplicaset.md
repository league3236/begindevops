
# Replication Controller

- 구 버전 (v1.8  이전)의 쿠버네티스에서 사용
- Pod가 항상 실행되도록 유지하는 쿠버네티스 리소스
  - 노드가 클러스터에서 사라지는 경우 해당 Pod를 감지하고 대체 Pod 생성
  - 실행 중인 Pod 목록 지속적 모니터링, 실제 Pod 수가 원하는 수와 항상 일치하는지 확인

## Replication Controller 세가지 요소

1. Label Selector : Replication Controller가 관리하는 Pod 범위를 결정 (rc는 Label로 Pod를 관리하기 때문)
2. 복제본 수 : 실행해야하는 Pod 수 결정
3. Pod 템플릿 : Pod의 모양을 설정

## Replication Controller의 장점

- Pod가 없는 경우 새 Pod를 항상 실행
- 노드에 장애 발생 시 다른 노드에 복제본 생성
- 수동, 자동으로 Pod 수평 스케일링

## Replication Controller 명령어

- Replication 생성

```
$ kubectl create -f {Replication Controller yaml}
```

- 생성된 Replication 확인

```
$ kubectl get rc
```

- rc의 Pod들이 어느 노드에 있는지 확인

```
$ kubectl get pod -o wide
```

- Replication Controller 삭제

```
$ kubectl delete rc {Replication Controller Name}
```

- Replication Controller 스케일링

방법 1)

```
$ kubectl scale rc {Replication Controller name} -- replicas{scale 변경 개수}
```

방법 2)

```
$ kubectl edit rc {Replication Controller Name}
```

방법 3)

vim으로 파일 수정

## Replica Set

- 쿠버네티스 1.8 버전부터 Deployment,  Daemonset,  ReplicaSet, StatefulSet API가 베타로 업데이트되고, 1.9 버전부터 정식으로 업데이트 됨
- 레플리카셋은 레플리케이션컨틀롤러를 완전히 대체 가능
- 일반적으로 레플리카셋을 직접 생성하지 않고 상위 수준의 디플로이먼트 리소스를 만들 때 자동으로 생성


# replicaset 과 replication controller 비교

replica set은 replication controller와 똑같이 동작하지만 더 풍부한 표현식 pod selector를 갖는다.
replication controller의 라벨 셀렉터는 특정 라벨을 포함하는 pod가 일치 하는지만 보는 반명 replicaset의 셀렉터는 특정 라벨이 없거나 해당 값과 관계없이 특정 라벨 키를 포함하는 pod를 매치하는지 확인한다.

또한 예를들어 단일 replication controller는 pod의 라벨 env=production 및 라벨 env=devel 과 동시에 일치 시킬 수 없고 하나의 env만 일치 가능하다. 그러나 단일 replicaset은 두 pod 세트 모두 일치 시킬 수 있다.

아래와 같이 구성된 replicaset은 
```
apiVersion: extensions/v1beta1
 kind: ReplicaSet
 metadata:
   name: example
 spec:
   replicas: 3
   selector:
     matchLabels:
       app: example
   template:
     metadata:
       labels:
         app: example
         environment: dev
     spec:
       containers:
       - name: example
         image: example/rs
         ports:
         - containerPort: 80
```

아래와 같은 라벨을 사용가능하다.

```
...
spec:
   replicas: 3
   selector:
     matchExpressions:
      - {key: app, operator: In, values: [example, example, rs]}
      - {key: teir, operator: NotIn, values: [production]}
  template:
     metadata:
...
```



## ref
- https://www.edureka.co/community/43891/difference-between-replica-set-and-replication-controller
- kubernetes in action