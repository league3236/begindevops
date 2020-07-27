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
