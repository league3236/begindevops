# docker(docker-swarm)

## 필요사항
- Docker Engine 1.12 이상

## 방화벽 오픈
- 클러스터 관리 통신을 위한 포트 : TCP 2377
- 노드 간 통신을 위한 포트 : TCP, UDP 7946
- 오버레이 네트워크 트래픽용 포트 : UDP 4789

## command list

- docker swarm 시작
```
$docker swarm init
```

- docker engine 관점에서 보다 상세한 정보
```
$docker info
```

- docker swarm node list
```
$docker node ls 
```

- docker swarm node 정보
```
$docker node inspect --prtty {node}
```

- docker worker to manger
```
$docker node promote {node}
```

- docker service 만들기
```
$docker service create {docker image} {command}
ex)
$docker service create --name ping --replicas 2 alpine ping docker.com

$docker service create --name gputest --replicas 1 tensorflow/tensorflow:nightly-gpu ls


```

- docker service 확인
```
ex)
$docker service ps ping
```

