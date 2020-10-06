# install

## ubuntu

- 이전 도커 버전 삭제

```
$ sudo apt-get remove docker docker-engine docker.io
```

- 필요 패키지 설치

```
$ sudo apt-get update && sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```

- 패키지 저장소 추가

```
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

```
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

- docker 패키지 검색 확인

```
$ sudo apt-get update && sudo apt-cache search docker-ce
```

- docker ce install

```
$ sudo apt-get update && sudo apt-get install docker-ce
```

- check
```
$ docker ps -a 

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```
