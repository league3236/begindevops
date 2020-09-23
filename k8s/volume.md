## ref 
- https://kubernetes.io/docs/concepts/storage/volumes/


# 볼륨

컨테이너의 on-disk file 은 일시적이므로 몇 가지 문제가 발생한다. 첫째, 컨테이너가 충돌하면 Kubelet이 해당 container를 restart를 하지만 파일이 손상된다.  둘째, 컨테이너를 실행할때 pod간에 파일을 공유해야 하는 경우가 많다. Kubernetes `Volume`은 이러한 문제를 해결 가능하다.


#  NFS 볼륨

## NFS 설치

- nfs 구축

```
$ apt-get update
$ apt install nfs-common nfs-kernel-server portmap
```

- workernode에 nfs-common 설치

```
$ apt-get update
$ apt install nfs-common
```

## NFS 설정 (NFS 서버에서 진행)

- `/etc/exports` 파일에 공유 정보 설정

- `nfs-server` 재시작

```
$ service nfs-server restart
```

- mount 가능한 서버 조회

```
$ showmount -e 127.0.0.1
```


- mount (client에서 진행) `mount t nfs {nfs 서버 ip}:{nfs 서버 mount 경로} {client 서버 mount 경로}`

- mount test

volume에 파일을 생성하면 mount 경로에서도 확인 가능함

