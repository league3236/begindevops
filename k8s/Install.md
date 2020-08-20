# k8s install with kubeadm

## swap memory 설정

```
  $swapoff -a
  or 
  $sed -i '2s/^/#/' /etc/fstab
  or
  $swapoff -a && sed -i '/swap/d' /etc/fstab
```

## ubuntu

### update package
```
$apt update && apt upgrade -y
```

### docker container 설치


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

### kubeadm, kubelet and kubectl 설치

- kubeadm : cluster bootstrap 명령어
- kubelet : cluster의 모든 노드에서 실행되며 pod 및 컨테이너 시작과 같은 작업을 수행
- kubectl : cluster를 제어하는 command line util

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

### 데몬 재시작
```
$systemctl daemon-reload
$systemctl restart kubelet
```

### [docker cgroup 변경](https://waspro.tistory.com/556)

docker cgroup 확인
```
$docker info
```

docker를 설치하면 기본 cgroup 드라이버는 cgroupfs로 적용되어 있음
이를 kubernetes에서 권고하는 systemd로 변경하기 위해서 적용시켜야함

/etc/systemd/system/kubelet.service.d/10-kubeadm.conf 라인추가
``` 
Environment="KUBELET_CGROUP_ARGS=–cgroup-driver=systemd"
```

cgroup driver 변경
```
$sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

docker cgroup 확인
```
$docker info | grep -i cgroup
```


### kubeadm init(master node)
```
$sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address {master ip}

or

sudo kubeadm init --control-plane-endpoint {masterip}:6443 --pod-network-cidr=10.244.0.0/16 --upload-certs --apiserver-advertise-address {masterip}

sudo kubeadm init --control-plane-endpoint apisvr.hoya.com:6443 --upload-certs
```

결과로 하단부에 node 추가 명령어(token 포함)을 get할 수 있다.
해당 부분은 추 후 worker노드 추가시 필요함으로 복사해 둔다.
```
$kubeadm join 10.1.8.4:6443 --token bhxxx~ \
    --discovery-token-ca-cert-hash sha256:1ede5a160524bf64f0c8423685e6dxxx~
```

### 클러스터 설정 파일 복사 명령어 실행(master node)
```
$mkdir -p $HOME/.kube
$sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### pod network 추가(master node)
master node가 초기화 된 다음에 pod 같의 통신을 위해서 pod network를 추가해 주어야 한다.
```
$sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

```

### 클러스터 노드 정보 확인(master node)
```
$kubectl get nodes
NAME         STATUS   ROLES    AGE   VERSION
k8s-master   Ready    master   14m   v1.18.4
```
만약 status 값이 NotReady 상태인 경우, Pod Network가 아직 deploy 되기 전 상태일 수 있습니다. 잠시 기다려주면 status가 변경될 수 있다.

자세한 내용을 보려면 아래 명령어를 입력한다.
```
$kubectl describe nodes
```

[ready 상태로 노드가 변경되지 않는다면 해당 링크를 참조](https://joecreager.com/troubleshooting-kubernetes-worker-node-notready/)

### worker 노드 추가(worker node)
worker node 추가 (복사했던 커맨드를 붙여 넣어준다)
```
$kubeadm join 10.1.8.4:6443 --token bhxxx~ \
    --discovery-token-ca-cert-hash sha256:1ede5a160524bf64f0c8423685e6dxxx~



W0628 07:16:43.087561    6851 join.go:346] [preflight] WARNING: JoinControlPane.controlPlane settings will be ignored when control-plane flag is not set.
[preflight] Running pre-flight checks
	[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.18" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

### 노드 추가 확인
```
$kubectl get nodes

NAME         STATUS   ROLES    AGE   VERSION
k8s-master   Ready    master   21m   v1.18.4
k8s-worker   Ready    <none>   93s   v1.18.4
```

### cluster 빠져나오기
```
$kubeadm reset
```

## ref
- https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/
- https://hiseon.me/linux/ubuntu/ubuntu-kubernetes-install/