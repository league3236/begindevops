# Deployment

RC를 이용해서 구현하는 방법은 운영이 복잡해지는 단점이 있다.
그래서 쿠버네티스에서는 일반적으로 RC를 이용해서 배포하지 않고
Deployment라는 개념을 사용한다.
Replica를 사용하여 롤링업데이틀 구성하면 RC를 두개 만들어야 하고, 하나씩 Pod의 수를 수동으로 조정해야 하기 때문에 이를 자동화해서 추상화한 개념이 Deployment이다.

- Replicaset과 Replication Controller 상위에서 배포되는 리소스
- 다수의 Replicaset을 다룰 수 있음
- 애플리케이션을 다운 타임 없이 업데이트 가능하도록 도와주는 리소스

## 모든 Pod를 업데이트 하는 방법

방법 1) recreate : 새로운 포드를 실행시키고, 작업이 완료되면 오래된 포드를 삭제 => 잠깐의 다운 타임 발생

방법 2) RollingUPdate

## rolling update

가장 많이 사용되는 배포 방식 중 하나

새 버전을 배포하면서, 새 버전 인스턴스를 하나씩 늘려나가고, 기존 버전을 하나씩 줄여나가는 방식이다.

이 경우 기존 버전과 새 버전이 동시에 존재할 수 있는 단점이 있지만, 시스템을 무 장애로 업데이트할 수 있다는 장점이 있다.

롤링 업데이트를 하려면 RC를 두개 만들어야 하고, RC의 replica수를 단계적으로 조절해줘야 한다. 또한 배포가 잘못되었을때 순서를 뒤집어서 진행하여야 한다.

## Deployment yaml 파일 작성 및 실행

예시)
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins-deployment
  labels:
    app: jenkins
spec:
  replicas: 3
  selector:
    matchLabels:
      app: jenkins
  template:
    metadata:
      labels:
        app: jenkins
      spec:
        containers:
        - name: jenkins
          image: jenkins
          ports:
          - containerPort: 8080
```

yaml 파일 실행

```
$ kubectl create -f {Deployment yaml} 

예시)
$ kubectl create -f jenkins-deployment.yaml 
deployment.apps/jenkins-deployment created
```

## 배포된 모든 애플리케이션 확인

```
$ kubectl get all

NAME                                      READY   STATUS    RESTARTS   AGE
pod/jenkins-deployment-5d7c95487d-4f49d   1/1     Running   0          75s
pod/jenkins-deployment-5d7c95487d-7qxs8   1/1     Running   0          75s
pod/jenkins-deployment-5d7c95487d-t8dxv   1/1     Running   0          75s
 
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   26h

NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/jenkins-deployment   3/3     3            3           75s

NAME                                            DESIRED   CURRENT   READY   AGE
replicaset.apps/jenkins-deployment-5d7c95487d   3         3         3       75s
```

### Deployment를 이용한 scale in/out

`scale` 명령어를 사용하여 Replicaset 개수 변경

```
$ kubectl scale deploy {Deployment 명} --replicas=5

예시)
$ kubectl scale deploy jenkins-deployment --replicas=5
deployment.apps/jenkins-deployment scaled
```

변경된 Pod 개수 확인

```
$ kubectl get pod -l app
NAME                                  READY   STATUS    RESTARTS   AGE
jenkins-deployment-5d7c95487d-dp4bx   1/1     Running   0          42s
jenkins-deployment-5d7c95487d-gv7wl   1/1     Running   0          8m4s
jenkins-deployment-5d7c95487d-lmgrw   1/1     Running   0          3m57s
jenkins-deployment-5d7c95487d-ltw2d   1/1     Running   0          42s
jenkins-deployment-5d7c95487d-t8dxv   1/1     Running   0          10m
```

### edit 명령어 사용

`edit` 명령어를 사용하여 Replicaset 개수 변경

```
$ kubectl edit deploy jenkins-deployment
deployment.apps/jenkins-deployment edited
```

변경된 Pod 개수 확인

```
$ kubectl get pod -l app
NAME                                  READY   STATUS    RESTARTS   AGE
jenkins-deployment-5d7c95487d-2nsds   1/1     Running   0          25s
jenkins-deployment-5d7c95487d-dp4bx   1/1     Running   0          2m31s
jenkins-deployment-5d7c95487d-f2szt   1/1     Running   0          25s
jenkins-deployment-5d7c95487d-gv7wl   1/1     Running   0          9m53s
jenkins-deployment-5d7c95487d-lmgrw   1/1     Running   0          5m46s
jenkins-deployment-5d7c95487d-ltw2d   1/1     Running   0          2m31s
jenkins-deployment-5d7c95487d-nsllt   1/1     Running   0          25s
jenkins-deployment-5d7c95487d-q2758   1/1     Running   0          25s
jenkins-deployment-5d7c95487d-sjqpw   1/1     Running   0          25s
jenkins-deployment-5d7c95487d-t8dxv   1/1     Running   0          12m
nginx                                 1/1     Running   0          14h
```

## ref
- https://bcho.tistory.com/1266
