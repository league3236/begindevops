# k8s 조금 더 알아가기

설치는 install.md를 참고 바란다.

## WEB UI (Dashboard)
- master node에서 실행
```
$kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
```

- 대시보드 UI 접근

클러스터 데이터를 보호하기 위해, 대시보드는 기본적으로 최소한의 RBAC 설정을 제공한다. 현재, 대시보드는 Bearer 토큰으로 로그인하는 방법을 제공한다. 

kubectl command line tool을 이용해 대시보드를 사용할 수 있다.
다만, UI는 커맨드가 실행된 머신에서만 접근 가능하다
```
$kubectl proxy
```

## kubectl 명령어

쿠버네티스는 kubectl 이라는 CLI 명령어를 통해서 쿠버네티스 및 클러스터 관리, 디버그 및 트러블 슈팅등이 가능하다.

kubectl은 $HOME/.kube에서 config 파일을 찾아, kubeconfig 환경변수 및 플래그를 설정하고,  kubeconfig 파일을 지정한다.

kubectl 명령어는 기본적으로 아래와 같은 형태로 커맨드 라인에 입력하여 사용할 수 있다.
> $kubectl [command] [type] [name] [flags]

- command : 자원에 실행하려는 동작
  - create : 생성
  - get : 정보가져오기
  - describe : 자세한 상태 정보
  - delete : 삭제
- type : 자원 타입
  - pod : Pod
  - service : 서비스
- name : 자원 이름
- flag : 옵션

### kubectl 기본 사용법

간단히 에코 서버(=클라이언트가 전송해주는 데이터를 그대로 되돌려 전송하는 서버)를 동작시키는 kubectl을 다뤄본다.

클러스터 작동 상태 확인
```
$kubectl cluster-info
```

버전 확인
```
$kubectl version


Client Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.4", GitCommit:"c96aede7b5205121079932896c4ad89bb93260af", GitTreeState:"clean", BuildDate:"2020-06-17T11:41:22Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.5", GitCommit:"e6503f8d8f769ace2f338794c914a96fc335df0f", GitTreeState:"clean", BuildDate:"2020-06-26T03:39:24Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
```

아래의 명령어를 통해서 echoserver라는 pod를 생성한다
```
$kubectl run echoserver --generator=run-pod/v1 --image="k8s.gcr.io/echoserver:1.10" --port=8080
```

run 명령어는 크럴스터에 특정 이미지를 가지고 pod를 생성하는 명령어이다.
```
$kubectl run [생성할 POD 이름] --generator=[Repolication Controller 지정] --image=[사용할 이미지] --port=[포트정보]
```

해당 명령어를 통해서 만들어진 echoserver pod의 서비스를 생성한다.
```
$kubectl expose pod echoserver --type=NodePort
```

pod의 정보 확인
```
$kubectl get pods

or

$kubectl get pods --all-namespaces
```
- NAME : Pod 이름
- READY : 0/1(생성되었지만 사용 준비 X), 1/1(생성되고 사용 준비 O)
- STATUS : Running(실행) / Terminating / ContainerCreating
- RESTARTS : 재시작 횟수
- AGE : 생성 후 지난 시간

service 정보 확인
```
$kubectl get services
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   18h
........
```
- NAME : 서비스 이름
- TYPE : 서비스 타입
  - Cluster IP : 서비스에 클러스터IP(내부IP)를 할당
  - Load Balancer : 외부 IP를 가진 로드밸런서를 할당
  - Node Port : 클러스터 IP 뿐만 아니라 노드의 IP 및 포트를 통해서 접근 할 수 있다
  - External Name : 외부 서비스를 쿠버네티스 내부에서 호출하고자 할때 사용
- CLUSTER-IP : 클러스터 안에서 사용하는 IP
- EXTERNAL-IP : 외부 IP
- PORT(S) : 서비스에 접속하는 포트
- AGE : 생성 후 지난 시간

로컬서버와 에코서버 8080포트로 포트포워딩 해주기 위한 명령어
```
$kubectl port-forward svc/echoserver 8080:8080
```

에코서버 실행 중 로그를 수집하려면 아래 명령어를 입력하여 확인 가능
```
$kubectl logs -f echoserver
```

pod 상태 확인
```
$kubectl describe pod {podname}
```

만들어진 에코 서버 pod 삭제
```
$kubectl delete pod echoserver
```

만들어진 에코 서버 service 삭제
```
$kubectl delete service echoserver
```

### kubectl을 사용해서 deployment 생성

- deployment

쿠버네티스 클러스터 위에는 컨테이너화된 애플리케이션을 배포할 수 있다. 그러기 위해서는 쿠버네티스 deployment 설정을 만들어야 한다. deployment는 쿠버네티스가 애플리케이션의 인스턴스를 어떻게 생성하고 업데이트해야 하는지를 지시한다. deployment가 만들어지면, 쿠버네티스 마스터가 해당 deployment에 포함된 애플리케이션 인스턴스가 클러스터의 개별 노드에서 실행되도록 스케줄링한다.

애플리케이션 인스턴스가 생성되면, 쿠버네티스 deployment controller는 지속적으로 이들 인스턴스를 모니터링한다. 인스턴스를 구동중인 노드가 다운되거나 삭제되면, 디플로이먼트 컨트롤러가 인스턴스를 클러스터 내부의 다른 노드의 인스턴스로 교체시켜준다. **이렇게 머신의 장애나 정비에 대응할 수 있는 자동 복구(self-healing) 메커니즘을 제공한다**

오케스트레이션 기능이 없던 환경에서는, 설치 스크립트가 애플리케이션을 시작하는데 종종 사용되곤 했지만, 머신의 장애가 발생한 경우 복구를 해주지는 않았다. 쿠버네티스 deployment는 애플리케이션 인스턴스를 생성해주고 여러 노드에 걸쳐서 지속적으로 인스턴스가 구동되도록 하는 두가지 모두 가능하기에 애플리케이션 관리를 위한 접근법에서 근본적인 차이를 가져다준다.

**Kubectl**이라는 쿠버네티스 CLI를 통해 deployment를 생성하고 관리할 수 있다. kubectl은 클러스터와 상호 작용하기 위해 쿠버네티스 API를 사용한다.

deployment를 생성할 때, 애플리케이션에 대한 컨테이너 이미지와 구동시키고자 하는 복제 수를 지정해야 한다. deployment를 업데이트해서 변경도 가능하다.

#### deployment an app

노드 정보 확인
```
$kubectl get nodes
```

deployment first app on kubernetes
```
$kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1

deployment.apps/kubernetes-bootcamp created
```

deployment list 
```
$kubectl get deployments

NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           52s
```

## nginx on Kubernetest

nginx는 리버스 프록시, 로드 밸런서, 메일 프록시 및 http 캐시로도 사용할 수 있는 웹 서버이다. 이 소프트웨어는 lgor sysoev에 의해 만들어졌으며 2004년에 처음 공개되었다. 

- nginx 배포
```
$ kubectl run nginx-one --image=nginx --generator=run-pod/v1 --port=80
```

- get pod
```
$ kubectl get pods
```

- 외부접근을 위한 서비스 배포
```
$ kubectl expose pod nginx-one --type=NodePort
```

- 서비스 확인
```
$ kubectl get services
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP        85m
nginx-one    NodePort    10.109.188.184   <none>        80:31111/TCP   2m2s
```

### manifest technique를 통한 nginx 배포

./yaml/nginx.yaml 참고

k8s는 JSON 형식의 manifest도 허용하지만 이러한 파일을 자주 편집하므로 YAML 형식이 JSON보다 읽기 쉽고 편집하기 쉽다.

- create
```
$kubectl create -f ./yaml/nginx.yaml
```

- show
```
$kubectl get deployments, replicasets, pods, services
```

- port-forward를 통해 접근
```
$kubectl port-forward svc/nginx-two 80:80
```

- 확인
```
$curl localhost:80
```

- delete
```
$kubectl delete -f ./yaml/nginx.yaml
```

## 특정 node에 pod 배포하기

Kubernetes 특정 node에 Pod를 배치하는 방법

알아가는 부분
- label
- nodeSelector
- affinity(nodeAffinity, podAffinity)

Kubernetes 구조는 크게 MasterNode / WorkerNode / InfraNode / IngressNode 등으로 구분 가능하다.

- MasterNode에는 Kubernetes를 관리하는 관리노드가 설치
- InfraNode에는 각종 Echo System(Monitoring, Logging, Tracing 등)이 설치
- WorkerNode에는 실제 Application이 배포되는 노드
- IngressNode에는 Ingress Controller가 배포되는 노드

예를 들어 Nginx를 사용하는 홈페이지 환경을 Docker 이미지로 생성하여 Kubernetes에 배포할 경우 해당 Pod는 WorkerNode에 구성되어야 한다.

또한 모니터링을 위해 Prometheus Docker Image를 배포할 경우 InfraNode에 Pod가 배포된다.
이와 같이 용도에 맞게 Pod를 배치 시킬 수 있는 Label 기능과 Label을 선택할 수 있는 NodeSelector & Affinity에 대해 테스트를 진행한다.

### Label 관리

1. node label info
현재 구성되어 있는 node들의 label 정보 확인
```
$kubectl get nodes --show-labels
```

2. node label add

```
$kubectl label nodes [node_name] [key]=[value]


example

root@k8s-master:~/testyaml# kubectl label nodes k8s-master key=master01
node/k8s-master labeled
root@k8s-master:~/testyaml# kubectl label nodes k8s-worker key=worker01
node/k8s-worker labeled

root@k8s-master:~/testyaml# kubectl get nodes --show-labels
NAME         STATUS   ROLES    AGE   VERSION   LABELS
k8s-master   Ready    master   44h   v1.18.4   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,key=master01,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s-master,kubernetes.io/os=linux,node-role.kubernetes.io/master=
k8s-worker   Ready    <none>   44h   v1.18.4   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,key=worker01,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s-worker,kubernetes.io/os=linux
```

key=master01, key=worker01이 추가 된 것을 확인할 수 있다.

3. node label delete
추가한 label을 삭제
```
$kubectl label nodes [node_name] [key]-

example)

root@k8s-master:~/testyaml# kubectl label node k8s-master key-
node/k8s-master labeled
```

### label을 이용해 특정 node에 pod 배포

1. nodeSelector
- ./yaml/nginx.yaml 참고
```
    spec:
      containers:
      - name: nginx-two
        image: nginx:1.17-alpine
        ports:
        - containerPort: 80
          name: nginx-pod-port
      
      ##추가
      nodeSelector:
        key: worker01
```
생성한 label 기준으로 deployment에 nodeSelector 추가


- 배포
```
$kubectl create -f ./yaml/nginx.yaml
```

- pod 내용 자세히 확인
```
$kubectl get pods -o wide
```

2. affinity

추후에 알아보기...


## ingress

ingress는 클러스터 외부에서 클러스터 내부 서비스로 HTTP와 HTTPS 경로를 노출한다. 트래픽 라우팅은 인그레스 리로스에 정의된 규칙에 의해 컨트롤 된다.

ingress는 외부에서 서비스로 접속이 가능한 URL, 로드 밸런스 트래픽, SSL /TLS 종료 그리고 이름 기반의 가상 호스팅을 제공하도록 구성할 수 있다.
ingress는 임의의 포트 또는 프로토콜을 노출시키지 않는다. HTTP와 HTTPS 이외의 서비스를 인터넷에 노출하려면 보통 **Service.Type=NodePort** 또는 **Service.Type=LoadBalancer** 유형의 서비스를 사용한다.

### 필요사항

ingress controller가 있어야 ingress를 사용가능하다.

ingress-nginx와 같은 ingress controller를 배포해야할 수 있다.
여러 ingress controller가 있으며 선택가능하다.

## 앱 재시작

앱 재시작과 같은 단순한 작업은 쿠버네티스에서 할 수 없었다. 쿠버네티스 입장에서는 같은 설정, 즉 기존설정과 비교했을 때 변경사항이 없는 앱은 재시작하지 않아도 된다고 생각한다. 하지만 앱 재시작 기능을 넣어달라는 사용자 요청이 많아지면서 쿠버네티스 CLI인 kubectl 1.15부터는 디플로이먼트, 스테이트풀세트, 데몬세트에 재시작 기능이 추가되었다.





## [control(master) 노드에도 pod 띄우기](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

```
$kubectl taint nodes --all node-role.kubernetes.io/master-
```


## GPU 스케줄링
쿠버네티스는 AMD 및 NVIDIA GPU를 관리하기 위한 초창기 버전을 지원한다.

### [device plugin 사용하기](https://kubernetes.io/ko/docs/tasks/manage-gpus/scheduling-gpus/)
쿠버네티스 device plugin을 구현하여 pod가 gpu와 같은 특별한 하드웨어 기능에 접근할 수 있게 한다.

관리자는 해당하는 하드웨어 벤터의 gpu 드라이버를 노드에 설치해야하며, gpu 벤더가 제공하는 디바이스 플러그인을 실행해야 한다.

- AMD
- NVIDIA

### gpu pod 생성

[참고자료](https://ssaru.github.io/2019/07/25/20190725-Connect_GPU_to_Minikube/)
[gpu 사용가이드 번역](https://github.com/gearbox-built/kubernetes-hugo/blob/eee64be96f3c8694507c264e5c015c745496e1a6/content/ko/docs/tasks/manage-gpus/scheduling-gpus.md)

- nvidia-docker2 설치
  - 준비사항
    1. GNU/Linux x86_64 with kernel version > 3.10
    2. Docker >= 1.12
    3. NVIDIA GPU with Architecture > Fermi(2.1)
    4. NVIDIA drivers ~= 361.93(untested on older versions)



## ref
- https://hiseon.me/linux/ubuntu/ubuntu-kubernetes-install/
- https://kubernetes.io/ko/docs/tasks/access-application-cluster/web-ui-dashboard/
- https://jungwoon.github.io/kubernetes/2020/01/19/Kubernetes-3/
- https://likefree.tistory.com/15
- https://www.katacoda.com/javajon/courses/kubernetes-applications/nginx
- https://waspro.tistory.com/582