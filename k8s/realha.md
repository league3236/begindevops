# kubernetes ha clustering 구성방법



## 환경
- os : ubuntu 18.06
- lb 2ea : cpu 2core, ram 4gb
- master 3ea : cpu 4core, ram 8gb
- worker 3ea : cpu 4core, ram 16gb
vip는 남는 ip를 할당 (서버가 안돌아가도됨) / aws라면 vip 할당받아서 사용

당시 버전은

kubeadm is already the newest version (1.18.6-00).
kubectl is already the newest version (1.18.6-00).
kubelet is already the newest version (1.18.6-00).

이며 k8s는 버전에 민감하여 추후에는 해당 방법이 작동을 안할 수 있음

## 설치

/etc/hosts 설정 (all node worker 추가 예정)
```

127.0.0.1	localhost

~~

# loadbalancer
10.231.238.226 hci-loadbalancer-vip
10.231.238.221 hci-loadbalancer-01
10.231.238.222 hci-loadbalancer-02


# K8s-Master
10.231.238.223 hci-k8s-master-01
10.231.238.224 hci-k8s-master-02
10.231.238.225 hci-k8s-master-03

# K8s-Worker
10.231.238.44 gs-gpu-1080ti-04
10.231.238.45 gs-gpu-1080ti-05
10.231.238.46 gs-gpu-1080ti-06
10.231.238.47 gs-gpu-1080ti-07
10.231.238.48 gs-gpu-1080ti-08
```

loadbalancer 설정(loadbalancer-01 and 02 node)
이때 haproxy는 한곳에서만 동작함(한곳이 죽으면 한곳이 살아남 즉, 노드한쪽에서 에러나도 이슈가 아님 ...  이곳에서 애먹음 )

- keepalived , haproxy 설치(lb1, lb2)
```
$ sudo apt install linux-headers-$(uname -r)
$ sudo apt install keepalived
$ sudo apt install haproxy
```

- keepalived 설정 (lb1)
vim /etc/keepalived/keepalived.conf
```
global_defs {
    notification_email {
    test@test.com
    test2 @test.com
}

notification_email_from lb1@test.com
    smtp_server localhost
    smtp_connect_timeout 30
}

vrrp_script chk_haproxy {
    script "killall -0 haproxy"
    interval 2
    weight 2
}


vrrp_instance VI_1 {
    state MASTER
    interface ens3          #네트워크 인터페이스에 따라 변경 필요
    virtual_router_id 51    # 두노드 일치
    priority 101            #lb1에 우선순위 101 할당
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111      #비밀번호 변경 필요
    }
    virtual_ipaddress {
        10.231.238.226      #vip 설정 필요
    }

    track_script {
        chk_haproxy
    }
}
```

- keepalived 설정 (lb2)
vim /etc/keepalived/keepalived.conf
```
global_defs {
    notification_email {
    test@test.com
    test2 @test.com
}

notification_email_from lb1@test.com
    smtp_server localhost
    smtp_connect_timeout 30
}

vrrp_script chk_haproxy {
    script "killall -0 haproxy"
    interval 2
    weight 2
}


vrrp_instance VI_2 {
    state BACKUP
    interface ens3          # 서버 net interface에 맞게 설정
    virtual_router_id 51    # 동일하게 51
    priority 100            # priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111         # pass 변경 필요
    }
    virtual_ipaddress {
        10.231.238.226          # vip 일치
    }

    track_script {
        chk_haproxy
    }
}
```

- keepalived 실행(lb1 & lb2)
```
$ systemctl enable keepalived
$ systemctl start keepalived
$ systemctl status keepalived
```

- keepalived로 생성한 가상 ip 확인(lb1 에서는 inet이 두개(본인,vip포함) 잡혀야함)
```
$ ip addr show ens3(네트워크 인터페이스 환경에 맞춰서)
```

- haproxy 설정 (lb1)
vim /etc/haproxy/haproxy.cfg
```
global
    log 127.0.0.1 local2
    maxconn 2000
    uid 0
    gid 0
    daemon # background process

defaults
    log global # global 설정 사용
    mode tcp # SSL 통신을 위해서는 TCP모드로 (http모드는 SSL 안됨)
    option tcplog
    option dontlognull # 데이터가 전송되지 않은 연결 로깅 제외
    retries 3 # 연결요청 재시도 횟수
    maxconn 2000 #option redispatch
    #timeout http-request 10s
    #timeout queue 1m
    timeout connect 10s
    timeout client 1m
    timeout server 1m

frontend ssl_front
    bind 10.231.238.226:16443 #VIP (port를 kube-api 서버와 다르게 설정해봄)
    default_backend ssl_backend

backend ssl_backend
    balance roundrobin
    option tcp-check # ssl-hello-chk option 사용하지 말것 - ssl3.0 protocol 이라 k8s api 서버 오류 유발 (TLS 1.2 이상만 지원)
    server hci-k8s-master-01 10.231.238.223:6443 check
    server hci-k8s-master-02 10.231.238.224:6443 check
    server hci-k8s-master-03 10.231.238.225:6443 check
```

- haproxy 설정(lb2)
```
global
    log 127.0.0.1 local2
    maxconn 2000
    uid 0
    gid 0
    daemon

defaults
    log global
    mode tcp
    option tcplog
    option dontlognull
    retries 3
    maxconn 2000
    #timeout http-request 10s
    #timeout queue 1m
    timeout connect 10s
    timeout client 1m
    timeout server 1m

frontend ssl_front
    bind 10.231.238.226:16443
    default_backend ssl_backend

backend ssl_backend
    balance roundrobin
    option tcp-check
    server hci-k8s-master-01 10.231.238.223:6443 check
    server hci-k8s-master-02 10.231.238.231:6443 check
    server hci-k8s-master-03 10.231.238.225:6443 check
```

- haproxy 사용가능상태(lb1, lb2)
```
$ systemctl enable haproxy
```

- haproxy 실행(lb1)
```
$ systemctl start haproxy
```

- loadbalancer 설정 확인(lb1)
```
$ nc -v {VIP}:{PORT} 

example)
$ nc -v 10.231.238.226 16443
```

아래와 같이 떠야함
```
# nc -v 10.231.238.226 16443
Connection to 10.231.238.226 16443 port [tcp/*] succeeded!
```

자이제 clustering을 본격적으로 구축해보자

- swap memory 설정(all node)
```
  $swapoff -a 
  $sed -i '2s/^/#/' /etc/fstab
  $swapoff -a && sed -i '/swap/d' /etc/fstab
```

- update package(all master/worker)
```
$apt update && apt upgrade -y
```

- docker container 설치(all master/worker)
uninstall old version of docker
```
$sudo apt-get remove docker docker-engine docker.io
```

install docker
```
$sudo apt install docker.io
```

start and automate docker
```
$sudo systemctl start docker

$sudo systemctl enable docker
```

docker version check
```
$docker --version
```

- docker의 cgroup driver를 systemd로 변경(all master/worker)
```
$ mkdir /etc/docker
$ cat > /etc/docker/daemon.json << EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF
$ mkdir -p /etc/systemd/system/docker.service.d
$ systemctl daemon-reload
$ systemctl enable docker
```

- 브릿지 되어있는 IPv4 트래픽을 iptables 체인으로 전달될 수 있도록 아래 명령어를 사용(all master/worker)
```
$ sudo sysctl -w net.bridge.bridge-nf-call-iptables=1
$ sudo sysctl -w net.ipv4.ip_forward=1
```

- kubeadm, kubectl, kubelet 설치(all master/worker)
```
$sudo apt-get install -y apt-transport-https curl

$curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add 

$cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF

$sudo apt-get update

$sudo apt install linux-image-extra-virtual ca-certificates curl software-properties-common -y

$sudo apt-get install -y kubelet kubeadm kubectl

$sudo apt-mark hold kubelet kubeadm kubectl

$sudo apt-get install -y kubernetes-cni
```



- kubeadm-config.yaml 작성(master-01)
vim ~/kubeadm-config.yaml
```
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: stable
controlPlaneEndpoint: "10.231.238.226:16443"
```

- kubernetes init(master-01)
```
$ kubeadm init --config kubeadm-config.yaml --upload-certs
```

결과값을 반환받는다. (위에가 master node join 아래가 worker node join이다)
```

You can now join any number of the control-plane node running the following command on each as root:

  kubeadm join 10.231.238.226:16443 --token 2zhcp6.mkiubm7tng1nxtpm \
    --discovery-token-ca-cert-hash sha256:7ebae7df85ef636e2e364e1ef181bd835c02de4f81b7401e7a97ac9724da49d5 \
    --control-plane --certificate-key 5d86fc4e2d465e1b6c7e1e4665557094efc43598f810970cdc93b843c1c78dfd

Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use
"kubeadm init phase upload-certs --upload-certs" to reload certs afterward.

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.231.238.226:16443 --token 2zhcp6.mkiubm7tng1nxtpm \
    --discovery-token-ca-cert-hash sha256:7ebae7df85ef636e2e364e1ef181bd835c02de4f81b7401e7a97ac9724da49d5
```

- 설정파일 복사(master01)
```
$ mkdir -p $HOME/.kube
$ cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ chown $(id -u):$(id -g) $HOME/.kube/config
```

- k8s 네트워크 배포(master01)
```
$ kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```


- 각 master노드에서 위에 join 입력(all master)
```
kubeadm join 10.231.238.226:16443 --token 2zhcp6.mkiubm7tng1nxtpm \
    --discovery-token-ca-cert-hash sha256:7ebae7df85ef636e2e364e1ef181bd835c02de4f81b7401e7a97ac9724da49d5 \
    --control-plane --certificate-key 5d86fc4e2d465e1b6c7e1e4665557094efc43598f810970cdc93b843c1c78dfd
```

- 각 worker 노드에서 위에 join 입력(all worker)
```
kubeadm join 10.231.238.226:16443 --token 2zhcp6.mkiubm7tng1nxtpm \
    --discovery-token-ca-cert-hash sha256:7ebae7df85ef636e2e364e1ef181bd835c02de4f81b7401e7a97ac9724da49d5
```

노드 확인(master01)
```
$ kubectl get nodes
```

## ref
- https://lascrea.tistory.com/213
- https://skysoo1111.tistory.com/47
- https://ysyu.kr/2019/10/how-to-ha-cluster-kubernetes-with-etcd/
- https://hiseon.me/linux/ubuntu/ubuntu-kubernetes-install/