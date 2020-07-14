# command list

- image pull
```
$ docker image pull {image}
```

- image -> container run
```
$ docker container run -t -p {hostport}:{containerport} {image}:{tag}

$ docker run -t -p {hostport}:{containerport} {image}:{tag}
```

- conatiner stop
```
$ docker stop {container id or name}
```

- container list 조회
```
$ docker ps -a
```

- 중지된 컨테이너 일괄 삭제(주의 요망 / 실서버에서 사용 지양)
```
$ docker container prune
```

- privileged mode
host 장치에 접근할 수 있으며, host 컴퓨터 커널의 대부분의 기능을 할 수 있다.
```
$ docker run --privileged [imagename] [otheroptions]
```

