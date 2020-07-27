# nvidia-docker 2.0 


# install

## Ubuntu18.04

- repo 설정

```
$curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | \
  sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list
```

- APT LISTS UPDATE

```
$ sudo apt-get update
```

-nvidia docker 2 install

```
$ sudo apt-get install -y nvidia-docker2
```

- docker daemon 설정

```
$ sudo pkill -SIGHUP dockerd
```

```
$ sudo apt-get remove nvidia -384 ; sudo apt-get install nvidia-384
```

- Check
```
$ docker run --runtime=nvidia --rm nvidia/cuda:9.0-base nvidia-smi
```

```
nvidia-docker --version 
```
위의 명령어를 입력시 아래와 같이 2.0 이상으로 나와야함

```
NVIDIA Docker: 2.4.0
Client:
 Version:           19.03.6
 API version:       1.40
 Go version:        go1.12.17
 Git commit:        369ce74a3c
 Built:             Fri Feb 28 23:45:43 2020
 OS/Arch:           linux/amd64
 Experimental:      false

Server:
 Engine:
  Version:          19.03.6
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.12.17
  Git commit:       369ce74a3c
  Built:            Wed Feb 19 01:06:16 2020
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.3.3-0ubuntu1~18.04.2
  GitCommit:
 runc:
  Version:          spec: 1.0.1-dev
  GitCommit:
 docker-init:
  Version:          0.18.0
  GitCommit:

```
