

# 쿠버네티스 상에서 mysql 설치하기

## PersistentVolume 과 PersistentVolumeClaim

Pod에 부하가 걸리거나, 이상 징후가 있을 경우 pod가 재시작되기 때문에 모든 데이터가 초기화 된다. 따라서, mysql 컨테이너를 쿠버네티스 pod를 통해서 구동시킬 때, persistent volume을 설정해야한다. persistent volume과 persistent volume claim에 대해서 알아보자

### Persistent Volume 이란?

쿠버네티스에는 volume이라는 저장공간이 있다. pod가 생성될 때 volume이 만들어 지고, pod를 삭제할때 volume도 삭제된다.
pod가 재시작될때는 volume을 계속 참조하기 때문에 데이터 영속성을 제공한다.

### volume type

- emptyDir : 임시저장할 데이터를 보관하는 volume
- hostPath : worker node의 파일시스템에 mounting 시키는 volume
- gitRepo : Git repository에 mount 시키는 volume

### persistent volume claim 이란?

persistent sotrage에 동적으로 프로비져닝 시키는 설정으로, volume을 pod에게 할당하는 과정은 아래와 같다.

1. 사용자가 pod에서 사용할 persistent volume이 필요한 경우 kubernetes를 통해서 PersistemtVolumeClaim을 생성한다.

2. 그리고 Kubernetes API server에게 PersistentVolumeClaim을 넘겨준다.

3. Kubernetes는 적합한 PersistentVolume을 찾고 PersistentVolumeClaim과 바인딩시킨다.
그리고 나서 pod에서는 PersistentVolumeClaim을 통해서 volume을 설정할 수 있다.

### mysql에 사용할 persistentVolume과 persistentVolumeClaim 설정하기

vim mysql-pv.yaml

```
kind: PersistentVolume
apiVersion: v1
metadata:
  name: mysql-pv-volume
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/home/mysql/data"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

AccessMode

- ReadWriteOnce (RWO)
: 해당 PV는 하나의 Pod에만 마운트되고 하나의 Pod에서만 읽고 쓰기가 가능하다

- ReadOnlyMany (ROX)
: 여러개의 Pod에 마운트가 가능하며, 여러개의 Pod에서 동시에 읽기가 가능하다. 쓰기는 불가능하다

- ReadWriteMany (RWX)
: 여러개의 Pod에 마운트가 가능하고, 동시에 여러개의 Pod에서 읽기와 쓰기가 가능하다.

PV의 라이프싸이클

PV는 생성이 되면, Available 상태가 된다. 이 상태에서 PVC에 바인딩이 되면 Bound 상태로 바뀌고 사용이 되며, 바인딩된 PVC가 삭제되면, PV가 삭제되는 것이 아니라 Relesed 상태가 된다.

persistent volume 생성 요청

```
$ kubectl apply -f mysql-pv.yaml
```

- Dynamic Provisioning

앞에서 본것과 같이 PV를 수동으로 생성한 후 PVC에 바인딩 한 후에, Pod에서 사용할 수 있지만, 쿠버네티스 1.6에서 부터 Dynamic Provisioning(동적 생성) 기능을 지원한다.

이 동적 생성 기능은 시스템 관리자가 별도로 디스크를 생성하고 PV를 생성할 필요 없이 PVC만 정의하면 이에 맞는 물리 디스크 생성 및 PV 생성을 자동화해주는 기능이다.


### mysql pod 생성

deployment와 service를 이용해서 mysql pod를 생성.
containers 항목에서 volumeMounts를 확인할 수 있다.
mysql-persistent-storage라는 이름으로 volume '/var/lib/mysql' (컨테이너 내부에서 실제 저장되는 경로) 디렉토리를 마운트 시키는 것으로 설정되어 있다.

vim mymysql.yaml
```
apiVersion: v1
kind: Service
metadata:
  name: mysql-cluster-ip-service
spec:
  clusterIP: 10.101.204.217
  ports:
  - port: 3306
  selector:
    app: mysql
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mymysql
spec:
  selector:
    matchLabels:
      app: mymysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: mymysql
    spec:
      nodeName: kube-node-1
      containers:
      - image: mysql/mysql-server:8.0
        name: mymysql
        env:
          # Use secret in real usage
        - name: MYSQL_ROOT_PASSWORD
          value: password
        ports:
        - containerPort: 3306
          name: mymysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
```

mysql pod 배포

```
$ kubectl apply -f mymysql.yaml
```



## ref
- https://velog.io/@pa324/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-mysql-%EC%84%A4%EC%B9%98-6bjxv4dcoa
- https://bcho.tistory.com/1259
