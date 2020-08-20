
# REF
- https://arisu1000.tistory.com/27859

# 쿠버네티스 DNS

쿠버네티스에서는 클러스터 내부에서만 사용가능한 DNS를 설정해놓고 사용할 수 있다. 그래서 포드간 통신을 할때나 IP가 아닌 도메인을 설정해 두고 사용할 수 있다. 그렇게 한 클러스터에서 아용하던 yaml 파일에서 포드간 통신을 도메인으로 설정해 둔다면 별다른 수정없기 그대로 다른 클러스터로 가져가서 사용하는 것도 가능하다.

ip로 통신하도록 되어있다면 한곳에 세팅해놨던 yaml 파일을 다른곳으로 옮겨 가져가서 사용하려고 할때 그 클러스터에서 사용하는 ip 대역이 다른것이라면 그대로 사용할 수 가 없게 된다. 이럴때 설정이 도메인을 사용하도록 되어 있다면 별다른 수정없이 그대로 사용할 수 있다.

그 뿐만 아니라 일부의 경우에는 서비스디스커버리(service discovery) 용도로 사용할 수 있다. 전문적인 서비스디스커버리를 사용하려면 dns가 아니라 다른 솔루션들을 사용해야 하겠지만 간단한 경우라면 dns를 이용해서 할 수도 있다. 

특정 pod들에 접근하려할때 도메인을 통해서 접근하도록 설정되어 있다면 pod에 문제가 생겨서 재생성되거나 배포때문에 재생성될때 IP가 변경되더라도 자동으로 도메인에 변경된 pod의 IP가 등록되기 때문에 자연스레 새로 시작된 pod 쪽으로 연결하는 것이 가능하다

## 클러스터내에서 도메인사용해보기

쿠버네티스에서 사용하는 내부 도메인은 service와 pod에 대해서 사용할 수 있고 일정한 패턴을 가지고 있다.

특정 서비스에 접근하는 도메인은 다음처럼 구성된다.

**aname**이라는 네임스페이스에 속한 **bservice**가 있다고 했을때 이 서비스에 접근하는 도멘인은 **bservice.aname.svc.cluster.local**이 된다. **bservice.aname** 순으로 서비스와 네임스페이스를 연결한 다음에 마지막에 **svc.cluster.local**을 붙이면 된다.

특정 pod에 접근하는 도메인은 다음처럼 구성된다.
default 네임스페이스에 속한 **cpod(10.10.10.10)**이라는 이름의 pod에 대한 도메인은 다음처럼 구성된다.

**10-10-10-10.default**

IP인 10.10.10.10에서 .을 -로 변경해서 사용하고 네임스페이스 이름인 default와 연결한 뒤에 pod.cluster.local을 붙여주면된다. 하지만 이렇게 하면 포드의 ip를 그대로 사용해야 하니깐 도메인 네임을 사용하는 장점이 사라지게 된다. 그래서 다른 방법을 사용할 수 있다. 포드를 실행할때 spec에 hostname와 subdomain을 지정해서 사용할 수 있다. 다음처럼 예제 yaml을 살펴보자. spec에 hostname와 subdomain을 지정한다.


vim testdns.yaml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubernetes-simple-app
  labels:
    app: kubernetes-simple-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubernetes-simple-app
  template:
    metadata:
      labels:
        app: kubernetes-simple-app
    spec:
      hostname: appname
      subdomain: default-subdomain
      containers:
      - name: kubernetes-simple-app
        image: arisu1000/simple-container-app:latest
        ports:
        - containerPort: 8080
```

이런 경우 이 포드에 접근할 수 있는 도메인은 appname-default-subdomain.default.svc.cluster.local으로 생성된다. hostname인 appname와 subdomain인 default-subdomain을 앞에 사용하고 네임스페인스인 default를 붙여준다음에 .svc.cluster.local을 붙여준다. 여기서 눈여겨봐야할점은 마지막에 붙인 .svc.cluster.local이 pod가 아니라 svc로 시작한다는 점이다.

해당 도메인을 사용하여 접근이 가능한지 살펴보자

```
$ kubectl apply -f testdns.yaml


$ kubectl get pods

NAME                                     READY   STATUS              RESTARTS   AGE
kubernetes-simple-app-55f6884cbb-rrw9z   0/1     ContainerCreating   0          3s
mymysql-8dddc55d6-z4pn9                  1/1     Running             0          5h13m
nginx-deployment-6bdf6857b5-dcr76        1/1     Running             0          35m

아래에서 에러가 발생한다..


$ kubectl exec kubernetes-simple-app-6695c7b497-wnz4g -- nslookup appname.default-subdomain.default.svc.cluster.local
nslookup: can't resolve '(null)': Name does not resolve

nslookup: can't resolve 'appname.default-subdomain.default.svc.cluster.local': Try again
```

원인 찾기

아래와 같이 정상적인 cluster pod안에 dns 설정부를 확인해보았다(katacoda playground)
```
master $ kubectl exec -it {PodName} -- nslookup kubernetes.default

example)

master $ kubectl exec -it kubernetes-simple-app-6695c7b497-q92cj -- nslookup kubernetes.default
nslookup: can't resolve '(null)': Name does not resolve

Name:      kubernetes.default
Address 1: 10.96.0.1 kubernetes.default.svc.cluster.local
```

안되는 내 cluster에서는 위와 같이 응답이 나오지 않았고

pod의 ip를 찾아 직접적으로 nslookup을 해보았다

```
$ kubectl get pods -o wide
NAME                                     READY   STATUS    RESTARTS   AGE    IP             NODE               NOMINATED NODE   READINESS GATES
kubernetes-simple-app-6695c7b497-qcmrf   1/1     Running   0          178m   192.168.1.35   {nodehost}   <none>           <none>

$ kubectl exec -it kubernetes-simple-app-6695c7b497-qcmrf -- nslookup 192.168.1.35
nslookup: can't resolve '(null)': Name does not resolve

Name:      192.168.1.35
Address 1: 192.168.1.35 appname.default-subdomain.default.svc.k8s
```

appname.default-subdomain.default.svc.k8s

끝부분이 .default.svc.k8s 되어있다.

resolve.conf를 확인해보자

정상적인 cluster에서는 resolv.conf는 아래와 같이 되어있다

```
$ kubectl exec {pod name} cat /etc/resolv.conf
nameserver 10.96.0.10
nameserver 8.8.8.8
search default.svc.cluster.local svc.cluster.local cluster.local
```

그러나 내가 구성한 클러스터는 아래와 같이 설정되어있다.

```
$ kubectl exec -it kubernetes-simple-app-6695c7b497-qcmrf -- cat /etc/resolv.conf


nameserver 10.96.0.10
search default.svc.k8s svc.k8s k8s
options ndots:5
```

**search default.svc.k8s svc.k8s k8s**

이부분을 한번 변경해보자
다음과 같이 dns 설정을 바꾸는것이 가능하다

$ vim dnsutils.yaml

```
apiVersion: v1
kind: Pod
metadata:
  name: dnsutils
  namespace: default
spec:
  containers:
  - name: dnsutils
    image: gcr.io/kubernetes-e2e-test-images/dnsutils:1.3
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
  restartPolicy: Always
  dnsPolicy: ClusterFirst
  dnsConfig:
    nameservers:
    - 8.8.8.8
    searches:
    - default.svc.cluster.local
    - svc.cluster.local
    - cluster.local
```

실행
```
$ kubectl create -f dnsutils.yaml
```


