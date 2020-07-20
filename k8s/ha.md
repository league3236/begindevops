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




## ref
- https://dewnine.tistory.com/6
- https://www.slideshare.net/ssuser4921ff/keepalived-haproxy
- https://arisu1000.tistory.com/27828