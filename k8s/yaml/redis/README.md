

redis master pods
```
$ kubectl create -f redis-master-controller.yaml
```

check
```
$ kubectl get rc
$ kubectl get pods
```

service
```
$ kubectl create -f redis-master-service.yaml
```

check
```
$ kubectl get services
$ kubectl describe services redis-master
```

redis slave controller
```
$ kubectl create -f redis-slave-controller.yaml
```

check
```
$ kubectl get rc
```

redis slave service
```
$ kubectl create -f redis-slave-service.yaml
```

check
```
$ kubectl get services
```

frontend 시작
```
$ kubectl create -f frontend-controller.yaml
```

```
$ kubectl get rc
$ kubectl get pods
```

service 시작
```
$ kubectl create -f fronted-service.yaml
$ kubectl get services
```
