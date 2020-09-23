## ref 
- https://kubernetes.io/docs/concepts/storage/volumes/


# 볼륨




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

