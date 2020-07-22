# replica set 과 replication controller 비교

replica set은 replication controller와 똑같이 동작하지만 더 풍부한 표현식 pod selector를 갖는다.
replication controller의 라벨 셀렉터는 특정 라벨을 포함하는 pod가 일치 하는지만 보는 반명 replicaset의 셀렉터는 특정 라벨이 없거나 해당 값과 관계없이 특정 라벨 키를 포함하는 pod를 매치하는지 확인한다.

또한 예를들어 단일 replication controller는 pod의 라벨 env=production 및 라벨 env=devel 과 동시에 일치 시킬 수 없고 하나의 env만 일치 가능하다. 그러나 단일 replicaset은 두 pod 세트 모두 일치 시킬 수 있다.

아래와 같이 구성된 replicaset은 
```
apiVersion: extensions/v1beta1
 kind: ReplicaSet
 metadata:
   name: example
 spec:
   replicas: 3
   selector:
     matchLabels:
       app: example
   template:
     metadata:
       labels:
         app: example
         environment: dev
     spec:
       containers:
       - name: example
         image: example/rs
         ports:
         - containerPort: 80
```

아래와 같은 라벨을 사용가능하다.

```
...
spec:
   replicas: 3
   selector:
     matchExpressions:
      - {key: app, operator: In, values: [example, example, rs]}
      - {key: teir, operator: NotIn, values: [production]}
  template:
     metadata:
...
```



## ref
- https://www.edureka.co/community/43891/difference-between-replica-set-and-replication-controller
- kubernetes in action