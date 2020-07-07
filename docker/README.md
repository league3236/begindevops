# docker

- 도커 이미지

도커 컨테이너를 구성하는 파일 시스템과 실행할 애플리케이션 설정을 하나로 합친 것으로 컨테이너를 생성하는 템플릿 역할을 한다

- 도커 컨테이너

도커 이미지를 기반으로 생성되며, 파일 시스템과 애플리케이션이 구체화돼 실행하는 상태

## RUN, CMD, ENTRYPOINT

- RUN 

보통 이미지위에 다른 패키지(프로그램)을 설치하고 새로운 레이어를 생성할때 사용한다. 

```
FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y curl
```
**RUN** 명령을 실행할 때 마다 레이어가 생성되고 캐시된다. 따라서 위와 같이 RUN 명령어를 따로 실행하면 apt-get update는 다시 실행되지 않아서 최신 패키지를 설치할 수 없다. 아래처럼 RUN 명령 하나에 입력해주어야 한다.

```
FROM ubuntu:14.04
RUN apt-get update && apt-get install y \
    curl \
    nginx \
&& rm -rf /var/lib/apt/lists/*
```

- CMD

**CMD**는 docker run 실행 시 명령어를 주지 않았을때 사용할 default 명령을 설정하거나, ENTRYPOINT의 default 파라미터를 설정할때 사용한다. **CMD**명령의 주용도는 컨테이너 실행할 때 사용할 default를 설정하는 것이다. **CMD** 명령은 3가지 형태가 있다.

1. CMD ["excutable", "param1", "param2"] (exec form, this is the preferred form)
2. CMD ["param1", "param2"] (as default parameters to ENTRYPOINT)
3. CMD command param1 param2 (shell form)

```
FROM ubuntu
CMD echo "This is a test."
```

docker run 시 아무 커멘드도 주지 않으면 실행되지만, 주게 되면 무시된다. **CMD**는 마지막에 있는 **CMD** 하나만 남게 된다.

- ENTRYPOINT

**ENTRYPOINT**는 2가지 형태를 가지고 있다.
- ENTRYPOINT ["excutable", "param1", "param2"] (exec form, preferred)
- ENTRYPOINT command pram1 parm2 (shell form)

docker run 실행시 실행되는 명령이라 생각 가능.

## ref

- 문서 도커,쿠버네티스
- https://blog.leocat.kr/notes/2017/01/08/docker-run-vs-cmd-vs-entrypoint
- https://www.guru99.com/docker-interview-questions.html