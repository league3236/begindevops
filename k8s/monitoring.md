# monitoring

해당문서는 [참고](https://medium.com/@yunhochung/k8s-%EB%8C%80%EC%89%AC%EB%B3%B4%EB%93%9C-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%99%B8%EB%B6%80-%EC%A0%91%EC%86%8D-%EA%B8%B0%EB%8A%A5-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0-22ed1cd0999f) 하여 이슈가 있는 부분은 제가 따로 수정하였습니다.

클라우드 환경에서 Ingress를 이용해서 L7 기반의 LB를 지원하나 Bare Metal 환경에서는 정상적으로 동작하지 않는다.

MetalLB 는 kubernetes 클러스터에 네트워크로드 밸런서 구현을 제공하여 모든 클러스터내에서 Loadbalancer 서비스를 효과적으로 사용할 수 있게 한다.

## MetalLB 설치

```
$ kubectl apply -f https://raw.githubusercontent.com/google/metallb/v0.8.3/manifests/metallb.yaml

$ kubectl get namespace

NAME              STATUS   AGE
.....
metallb-system    Active   3m16s

$ kubectl get pods -n metallb-system
NAME                          READY   STATUS    RESTARTS   AGE
controller-5f98465b6b-srbtf   1/1     Running   0          7m14s
speaker-k7tw8                 1/1     Running   0          7m14s
speaker-ldskq                 1/1     Running   0          7m14s
speaker-wcvx5                 1/1     Running   0          7m14s
```

configmap 작성

vim layer2-config.yaml
```
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.56.240-192.168.56.250
```

설정파일 적용

```
$ kubectl apply -f layer2-config.yaml
```

로그 확인
```
$kubectl logs -l component=speaker -n metallb-system


{"caller":"bgp_controller.go:285","event":"nodeLabelsChanged","msg":"Node labels changed, resyncing BGP peers","ts":"2020-07-04T23:30:36.871089105Z"}
{"caller":"main.go:289","configmap":"metallb-system/config","event":"startUpdate","msg":"start of config update","ts":"2020-07-04T23:44:33.267748796Z"}
{"caller":"main.go:313","configmap":"metallb-system/config","event":"endUpdate","msg":"end of config update","ts":"2020-07-04T23:44:33.267787097Z"}
{"caller":"k8s.go:376","configmap":"metallb-system/config","event":"configLoaded","msg":"config (re)loaded","ts":"2020-07-04T23:44:33.267797797Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"kube-system/kube-dns","ts":"2020-07-04T23:44:33.272911157Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"kube-system/kube-dns","ts":"2020-07-04T23:44:33.272941458Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"default/nginx-two","ts":"2020-07-04T23:44:33.272954158Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"default/nginx-two","ts":"2020-07-04T23:44:33.272962558Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"default/kubernetes","ts":"2020-07-04T23:44:33.272971758Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"default/kubernetes","ts":"2020-07-04T23:44:33.272980358Z"}
{"caller":"bgp_controller.go:285","event":"nodeLabelsChanged","msg":"Node labels changed, resyncing BGP peers","ts":"2020-07-04T23:30:35.30094974Z"}
{"caller":"main.go:289","configmap":"metallb-system/config","event":"startUpdate","msg":"start of config update","ts":"2020-07-04T23:44:33.265435357Z"}
{"caller":"main.go:313","configmap":"metallb-system/config","event":"endUpdate","msg":"end of config update","ts":"2020-07-04T23:44:33.265649058Z"}
{"caller":"k8s.go:376","configmap":"metallb-system/config","event":"configLoaded","msg":"config (re)loaded","ts":"2020-07-04T23:44:33.26584256Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"default/kubernetes","ts":"2020-07-04T23:44:33.271325802Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"default/kubernetes","ts":"2020-07-04T23:44:33.271466703Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"default/nginx-two","ts":"2020-07-04T23:44:33.271515204Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"default/nginx-two","ts":"2020-07-04T23:44:33.271549304Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"kube-system/kube-dns","ts":"2020-07-04T23:44:33.271631405Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"kube-system/kube-dns","ts":"2020-07-04T23:44:33.271675105Z"}
{"caller":"bgp_controller.go:285","event":"nodeLabelsChanged","msg":"Node labels changed, resyncing BGP peers","ts":"2020-07-04T23:30:35.191925044Z"}
{"caller":"main.go:289","configmap":"metallb-system/config","event":"startUpdate","msg":"start of config update","ts":"2020-07-04T23:44:33.273605127Z"}
{"caller":"main.go:313","configmap":"metallb-system/config","event":"endUpdate","msg":"end of config update","ts":"2020-07-04T23:44:33.273647727Z"}
{"caller":"k8s.go:376","configmap":"metallb-system/config","event":"configLoaded","msg":"config (re)loaded","ts":"2020-07-04T23:44:33.273659427Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"default/nginx-two","ts":"2020-07-04T23:44:33.278862434Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"default/nginx-two","ts":"2020-07-04T23:44:33.278966934Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"kube-system/kube-dns","ts":"2020-07-04T23:44:33.279001834Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"kube-system/kube-dns","ts":"2020-07-04T23:44:33.279030634Z"}
{"caller":"main.go:176","event":"startUpdate","msg":"start of service update","service":"default/kubernetes","ts":"2020-07-04T23:44:33.279057834Z"}
{"caller":"main.go:180","event":"endUpdate","msg":"end of service update","service":"default/kubernetes","ts":"2020-07-04T23:44:33.279085934Z"}
```

## dashboard 설치

dashboard에서 사용할 CSR과 SSL Cert를 생성한다.

참고자료의 pass:x로는 에러가 나서 pass:gsahdg 로 변경해주었다.

- 개인키,  CSR 생성
```
$ mkdir certs; cd certs

$ openssl genrsa -des3 -passout pass:gsahdg -out dashboard.pass.key 2048

$ openssl rsa -passin pass:gsahdg -in dashboard.pass.key -out dashboard.key

writing RSA key

$ rm dashboard.pass.key


$ openssl req -new -key dashboard.key -out dashboard.csr

You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:KR
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:Seoul
Organization Name (eg, company) [Internet Widgits Pty Ltd]:SH
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:dashboard.k8s
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

- SSL Certificate 생성
```
$ openssl x509 -req -sha256 -days 365 -in dashboard.csr -signkey dashboard.key -out dashboard.crt

Signature ok
subject=C = KR, ST = Some-State, L = Seoul, O = SH, CN = dashboard.k8s
Getting Private key
```

- k8s secret 생성

```
$ ls
dashboard.crt  dashboard.csr  dashboard.key

$ cd ..

$ kubectl create secret generic kubernetes-dashboard-certs --from-file=./certs -n kube-system

secret/kubernetes-dashboard-certs created
```

- Dashboard Yaml파일을 다운로드 한 후 Service의 type을 LoadBalancer로 수정한다.

```
$ wget https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml
```

vim kubernetes-dashboard.yaml

맨아래 dashboard service에 loadbalancer를 추가한다.

```
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule

---
# ------------------- Dashboard Service ------------------- #

kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  type: LoadBalancer   #<<-- 추가해야함
  ports:
    - port: 443
      targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
```

적용
```
$ kubectl apply -f kubernetes-dashboard.yaml
```

체크
```
$ kubectl get svc --all-namespaces

kube-system   kubernetes-dashboard   LoadBalancer   10.101.57.133   192.168.56.240   443:30827/TCP            27s
```

## Dashboard Admin 생성

아래와 같이 Dashboard Admin Yaml 파일을 작성한다.

vi dashboard-admin.yaml 
```
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kube-system
```

적용
```
$ kubectl apply -f dashboard-admin.yaml
```

token을 구한다.(대시보드 로그인 시 사용)

```
$ kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IlRMNmJxMEJDLWdLZ2NjWHZsem9NTjJWSW0xQU12a2ZJNzIwRGktcl9LaFEifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLXd2bWRyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJlZTZhMjIwOS03YjliLTQxYmEtOTIyNy0yNjI0M2Q0NWUwOTQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.I2laVY87LZoQqSI7qn7HlwWQdYxMb6CtBbDJipJAKkQaqcYUj8RqmBWVVZmqmyOoiPPxVZ8QTpw5q_IEgOFARW5sEbvdnX11el_AWwF31JXTLujnWoDj48dyD5UpnD1Lyf3SX0bkVyYW9L1kXvGMEe9YkxwSo42yxYPH-Tl1h5k8xcvz8iH9XoMwg8EFcU9NzMDylZAkAnydRQUng0voFmuzhko2BYEHk82BcpR_1OXjAZY8rtDfd5-WVlysfSZHJABYYd9NR9Kc-ACdef4qfpcdhkc6dGI5bXTjFqKpVuTTDTuZp1oy6txArutKEmtX78I_2eJGvxp7-j70qQUkiQ
```

적용후 아래를 참고해서 {externalip}:{port}로 접근한다

예시 192.168.56.240:30827
```
kubectl get svc --all-namespaces
NAMESPACE     NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                  AGE

kube-system   kubernetes-dashboard   LoadBalancer   10.101.57.133   192.168.56.240   443:30827/TCP
```

적용후 위에서 복사한 토큰을 입력해준다.

## 삭제

적용 잘못해서 삭제해야하는경우
```
  $ kubectl delete -f dashboard-admin.yaml
  $ kubectl delete -f kubernetes-dashboard.yaml
  $ kubectl delete -f layer2-config.yaml
  $ kubectl delete -f https://raw.githubusercontent.com/google/metallb/v0.8.3/manifests/metallb.yaml
```


다른 방법으로 dashboard를 구축해보았다.

## dashboard 설치

공식문서 참고하여 설치
```
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml



namespace/kubernetes-dashboard created
serviceaccount/kubernetes-dashboard created
service/kubernetes-dashboard created
secret/kubernetes-dashboard-certs created
secret/kubernetes-dashboard-csrf created
secret/kubernetes-dashboard-key-holder created
configmap/kubernetes-dashboard-settings created
role.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard created
rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
deployment.apps/kubernetes-dashboard created
service/dashboard-metrics-scraper created
deployment.apps/dashboard-metrics-scraper created
```

설치된 pod 확인
```
$ kubectl get pods --all-namespaces

kubernetes-dashboard   dashboard-metrics-scraper-6b4884c9d5-4zltp   1/1     Running        0          49s
kubernetes-dashboard   kubernetes-dashboard-7b544877d5-sk54k        1/1     Running        0          49s
```

외부에서 접근가능한 proxy 띄우기
```
$ kubectl proxy --port=8001 --address=10.1.8.4 --accept-hosts='^*$'
```

접근
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

## ref
- https://kubernetes.github.io/ingress-nginx/deploy/baremetal/
- https://medium.com/@yunhochung/k8s-%EB%8C%80%EC%89%AC%EB%B3%B4%EB%93%9C-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%99%B8%EB%B6%80-%EC%A0%91%EC%86%8D-%EA%B8%B0%EB%8A%A5-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0-22ed1cd0999f
- https://boying-blog.tistory.com/16
- https://crystalcube.co.kr/199
- https://usquebath.tistory.com/3

