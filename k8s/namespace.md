# namespace 

쿠버네티스는 동일한 물리 클러스터를 기반으로 하는 여러 가상 클러스터를 지원한다.  물리 클러스터 안에서 논리적으로 하나의 시스템처럼 동작하는 집합을 **Namespace**라고 한다.

네임스페이스는 여러 개의 팀이나, 프로젝트에 걸쳐서 많은 사용자가 있는 환경에서 사용되도록 만들어졌다. 사용자가 거의 없거나, 수십명 정도가 되는 경우에는 Namespace를 고려하지 않아도 된다.

Namespace는 서로 중첩될 수 없으며, 각 쿠버네티스 리소스는 하나의 네임스페이스에만 있을 수 있다.

Namespace는 클러스터 자원을 여러 사용자 사이에서 나누는 방식이다.

- namespace 조회
```
$ kubectl get namespace

NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-public       Active   1d
kube-system       Active   1d
```

쿠버네티스는 처음에 4개의 네임스페이스를 갖는다.
1. default : 기본 오브젝트의 namespace
2. kube-system : kubenetes system에서 생성한 오브젝트의 namespace
3. kube-public : 자동으로 생성되며 모든 사용자가 읽기전용으로 접근할 수 있다.
4. kube-node-lease : 클러스터가 스케일링될 때 노드 heart beat의 성능을 향상시키는 노드와 관련된 lease 오브젝트에 대한 namespace

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
- https://kubernetes.io/ko/docs/concepts/overview/working-with-objects/namespaces/
- https://velog.io/@rudasoft/03.-Namespace-%EC%83%9D%EC%84%B1
