
# HA 구성

## [docker swarm 고가용성 - 소용환의 생각저장소](https://www.sauru.so/blog/high-availability-of-docker-swarm/)

Swarm 뿐만 아니라 모든 클러스터 환경에서, 두 가지 관점의 가용성을 고려할 필요가 있다. 첫번째는, 클러스터를 이루는 요소 중 일부에 장애가 발생한 경우, 그것이 현재 가동중에 있는 서비스/업무에 영향을 주지 않아야 한다는 것이고, 다른 하나는 일부 구성요소가 가용하지 않음에도 불구하고, 그 클러스터가 여전히 제어 가능한 상태에 있어야 한다는 것이다. 편의 상,  이 두 경우에 대해서 각각 "서비스의 가용성"과 "제어의 가용성"이라고 칭하겠다....

Swarm의 경우, 서비스의 가용성은 Manager의 scheduling기능에 의해 보장된다. Scheduler는 Swarm에게 serivce가 할당되었을 때, 그것을 task로 나누고 다시 이 task에 slot 개념을 적용하며, 빈 slot이 없도록 유지관리하는 기능을 가지고 있다.
또한 제어의 가용성에 대해서는, 복수의 Manager Node로 구성된 Manager Pool을 구성하여 Manager 중 일부가 죽더라도 기능이 정상적으로 동작할 수 있도록 현황정보 공유를 포함한 클러스터 기능을 제공하고 있다.

### manager와 worker가 혼합된 클러스터

만약, 10여 대의 (숫자가 중요하지 않다.  예일 뿐이다.) 소규모 클러스터를 운영할 경우, 그리고 부하에 대한 예측이 가능한 경우라면 구태여 manager를 구분한 필요가 없을 수 있다.

## [container ochestraition tool] (https://medium.com/dtevangelist/docker-%EA%B8%B0%EB%B3%B8-6-8-docker%EC%9D%98-container-ochestartion-swarm-4ddfb3a8cd83)

container ochestration tool은 swarm만 있는 것이 아닙니다. Google에서 kubernetes, apache mesos등이 있으며, 더 확장해서 ochestration tool들을 관리해주는 rancher라는 것도 있습니다. 현재는 kubernetes가 가장 많이 사용되고 있으며, 가장 탁원한 성능을 자랑한다고 볼 수 있습니다. 반면 docker swarm은 제 개인적인 의견으로는 kubernetes 보다 가볍고, 사용하기 쉽지만, kubernetes의 성능과 기능에 비해서 대규모 서비스 운영에 대해서는 부족하다고 생각됩니다.

## node3개에서의 HA 구성

그래서 우리는 node 3개에서 ha 구성을하기로 하였고.
각각 vagrant로 vm3개씩을 띄어 각각의 노드에 마스터 1, 워커3개를 구성하였음
관련 명령어는 아래에서 확인 가능

노드 3개에 vm 3개씩을 구축하고 docker-swarm을 구축, HA 환경을 구성해야 할 필요성이 있었다.

이때, master vm을 외부 노드에서 접근하기 위해서는 포트포워딩 작업, 그리고 vagrant가 아닌 virtualbox cli로 각각 vm을 컨트롤해야하는 상황이 발생했고, 해당 커맨드를 정리하였다.

### vagrant
띄우기
```
$vagrant up
```

상태 확인
```
$vagrant status
```

### virtualbox manage vboxmanage로 vm 관리
virtual box vm 목록 확인
```
$vboxmanage list vms
```
결과로 나온것들이 vm 아이디가 된다.

vm 종료
```
$vboxmanage controlvm {vmID} savestate
```

vm 삭제
```
$vboxmanage unregistervm {vmID} --delete
```

vm 실행
```
$vboxmanage startvm {vmID} --type headless
```
docker swarm을 위한 포트포워딩 작업
```
$VBoxManage modifyvm {vmID} --natpf1 "dockerswarm,tcp,{호스스트 외부 ip},2377,{master vm ip},2377"

example)
$VBoxManage modifyvm "docker-swarm-demo_first-01_1592465862367_56110" --natpf1 "dockerswarm,tcp,10.1.3.4,2377,172.17.8.101,2377"

$vboxmanage modifyvm "docker-swarm-demo_first-01_1592465862367_56110" --natpf1 "networkdiscovery,tcp,10.1.3.4,7946,172.17.8.101,7946"

vboxmanage modifyvm "docker-swarm-demo_first-01_1592465862367_56110" --natpf1 "networkdiscovery1,tcp,10.1.3.4,7946,10.0.2.15,7946"

$vboxmanage modifyvm "docker-swarm-demo_first-01_1592465862367_56110" --natpf1 "overlaynetwork,tcp,10.1.3.4,4789,172.17.8.101,4789"

vboxmanage modifyvm "docker-swarm-demo_first-01_1592465862367_56110" --natpf1 "overlaynetwork1,tcp,10.1.3.4,4789,10.0.2.15,4789"
```
만약 포트포워딩이 잘못되었으면 삭제하고 다시등록해야하는데 필요한 명령어
```
$VBoxManage modifyvm {vmID} --natpf1 delete dockerswarm
```
정상적으로 등록되었는지 확인가능하다
```
$vboxmanage showvminfo {vmID}
```

### docker , swarm

도커 정보 확인
```
$docker info
```

swarm init(master)
```
$docker swarm init 

example
$docker swarm init --advertise-addr 172.17.8.101
```

swarm join(worker)
```
$ docker swarm join --token {tokenkey} {ip}

exmaple
$docker swarm join --token SWMTKN-1-2grjcs6b86ter805mb6iwrx0t23wjnu9o6hso59i4wmp1s2gbq-ciysvs541wjedpebopdgi719p 52.231.65.107:2377
```

swarm 탈퇴(master & worker)
```
$docker swarm leave
```

노드 확인
```
$docker node ls
```

worker node를 manager node로 승격
```
$docker node promote {node id}

or 

$docker node update --role manager {node id}

example
core@first-01 ~ $ docker node promote core-01
Node core-01 promoted to a manager in the swarm.
```

manager node 승격해제
```
$docker node demote {nodeid}
```

혹시 승격이 안되면 leave로 탈퇴했다가 manager용 토큰으로 join해보자

도커 스웜 노드 제외
```
$docker node rm {nodeid}
```

manager token get
```
$docker swarm join-token manager

example)
To add a manager to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-2grjcs6b86ter805mb6iwrx0t23wjnu9o6hso59i4wmp1s2gbq-a029bjiwvwtsri4qhgiynr11n 172.17.8.101:2377
```

service 확인
```
$docker service ls
```

에러시 도커 서비스 log 거꾸로 확인
```
$journalctl -r -u docker.service
```

worker노드에서는 아래 포트를 열어주어야 한다.
> 7946, 4789

> Firewall considerations
> Docker daemons participating in a swarm need the ability  to communicate with each other over the following ports:
> 
> Port 7946 TCP/UDP for container network discovery.
> Port 4789 UDP for the container overlay network.
