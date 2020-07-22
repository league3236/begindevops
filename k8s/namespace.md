# namespace 

물리 클러스터 안에서 논리적으로 하나의 시스템처럼 동작하는 집합을 **Namespace**라고 한다.

- namespace.yaml
```
apiVersion: v1
kind: Namespace
metadata:
  name: league
```

- create
```
$ kubectl apply -f namespace.yaml
```

- check
```
$ kubectl get namespace
$ kubectl describe namespace league
```

## ref
- https://velog.io/@rudasoft/03.-Namespace-%EC%83%9D%EC%84%B1
