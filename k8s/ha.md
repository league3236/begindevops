# 로드 밸런싱이란?



# keepalived

keepalived는 서비스의 가동 상태를 감시하는 소프트웨어로 서비스에 장애가 발생하여 정시했을 경우 그 서버로 오는 요청을 다른 가용 서버로 할당하도록 하여 서비스가 정지하지 않고 무정지 운영이 가능하도록 하는 기능을 가지고 있다.

## VRRP
- RFC Standard 문서에 정의된 표준 HSRP와 다르게 Cisco 뿐만 아니라, 모든 vendor에서도 지원되는 protocol이다.
- 기본적으로, VRRP의 동작원리는 여러대 (최소 2대 이상)의 Router를 하나의 Group으로 묶어서, Client가 바라보는 Gateway 에 대한 IP Address를 공유하며, Priority가 높은 Routerfh ehdwkrgkekrk, Router에 문제가 발생하면, 그 다음 Priority를 가진 Router가 Active role을 자기고 Gateway IP Address를 넘겨 받아 동작하여, Client 입장에서는 Router의 장애와 관계 없이 Gateway의 IP Address를 변경하지 않고 Data를 정의한다.

## 설치
```bash
$ yum install keepalived
```


## VRRP 기능

- ipvs의 분산테이블을 real server의 상태(up/down)을 체크하고, 동적으로 설정하는 healthcheck
- 패킷의 분산을 실행하는 서버 자체를 failover


# etcd

etcd는 고가용성을 제공하는 키-밸류(key-value) 저장소이다.
쿠버네티스에서 필요한 모든 데이터를 저장하는 실질적인 데이터베이스이다. 원래 쿠버네티스는 처음에 구글 내부의 보그(borg)라는 컨테이너 오케스트레이션 도구의 오픈소스화를 진행하면서 나왔다.
보그가 구글에서 사용될때는 구글 내부의 처비(chubby)라는 분산 저장 솔루션을 사용했었다. 이와 비슷한 솔루션을 사용하기 위해서 쿠버네티스로 오픈소스할때 etcd를 사용하게 되었다. etcd는 프로세스 1개만 띄워서 사용할수도 있지만 데이터의 안정성을위해서는 여러개의 장비에 분산해서 etcd 자체를 클러스터링을 구성해서 띄우는게 일반적인 방법이다.
etcd가 안정적이기는 하지만 보다 안정적으로 쿠버네티스를 운영하려면 주기적으로 etcd에 있는 데이터를 백업해 두는게 좋다.

# HAProxy

HAProxy는 기존의 하드웨어 스위치를 대체하는 소프트웨어 로드 밸런서로, 네트워크 스위치에서 제공하는 L4, L7 기능 및 로드밸런서 기능을 제공한다. HAProxy는 설치가 쉽고 또한 환경 설정도 어렵지 않으므로 서비스 이중화를 빠르게 구성하고 싶다면 HAProxy를 추천한다.

# ipvsadm

LVS(Linux Virtual Server)는 리눅스에서 구현된 로드밸런스 솔루션으로, L4 스위치 역할을 한다.
LVS는 ipsvadm 패키지를 설치한다.
할당방식은 아래와 같이 여러가지가 존재한다.

- rr(Round Robin) : 실 서버에 한번씩 번갈아가며 접속하는 방법
- wrr(Weighted Round Robin) : 라운드로빈 방식에서 실제 서버에 가중치를 주어 가중치가 높은 서버에 더 자주 접속하는 방법
- lc(Least-Connection) : 가장 접속이 적은 실제 서버로 더 많은 요청을 배분하는 방식
- wlc(Weighted Least-Connection) : lc 방식에 가중치(Ci/Wi)를 주어 특정 서버에 더 많은 작업을 할당하는 방식
...



# kube-apiserver

쿠버네티스는 msa(마이크로서비스아키텍처, Micro Service Architecture) 구조로 되어 있다. 그중에서 kube-apiserver는 쿠버네티스 클러스터의 api를 사용할 수 있게 해주는 프로세스이다.
클러스터로 요청이 왔을대 그 요청이 유효한지 검증하는 역할을 한다.

- hosts 설정
vim /etc/hosts
```
127.0.0.1 localhost

# etcd
{etcd1 internal ip} etcd-1.k8s.io
{etcd1 external ip} etcd-1.k8s.io

# K8s-Master
{k8s-master internal ip} m-1.k8s.io
{k8s-master external ip} m-1.k8s.io

# K8s-Node
{k8s-worker internal ip} n-1.k8s.io
{k8s-worker external ip} n-1.k8s.io

```

- etcd 노드 2대에 haproxy, ipvsadm, keepalived 구성
centos
```
$ rpm -Uvh http://www.nosuchhost.net/~cheese/fedora/packages/epel-7/x86_64/cheese-release-7-1.noarch.rpm
$ yum install haproxy keepalived ipvsadm -y
```

- sysctl 환경 설정

vim /etc/sysctl.conf
```
net.ipv4.ip_nonlocal_bind=1
net.ipv4.ip_forward = 1
```

check
```
$ sysctl -p
```

- haproxy 환경 설정
vim /etc/haproxy/haproxy.cfg
```
global
    user haproxy
    group haproxy

defaults
    mode http
    log global
    timeout connect 3000ms
    timeout server 5000ms
    timeout client 5000ms

frontend k8s-api
    mode tcp
    option tcplog
    bind 10.10.0.30:6443
    default_backend k8s-m

backend k8s-m
    mode tcp
    balance roundrobin
    option tcp-check
    server m-1 10.10.0.31:6443 check fall 3 rise 2
    server m-2 10.10.0.32:6443 check fall 3 rise 2
    server m-3 10.10.0.33:6443 check fall 3 rise 2

listen stats
    mode http
    bind *:80
    log global

    stats enable
    stats refresh 10s
    stats show-node
    stats uri /haproxy
```



## ref
- https://dewnine.tistory.com/6
- https://www.slideshare.net/ssuser4921ff/keepalived-haproxy
- https://arisu1000.tistory.com/27828
- https://d2.naver.com/helloworld/284659
- https://ysyu.kr/2019/10/how-to-ha-cluster-kubernetes-with-etcd/
- https://blog.boxcorea.com/wp/archives/1803
- https://crystalcube.co.kr/203