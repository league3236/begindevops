# 특정 node에 pod 할당하기

pod를 특정 node에만 동작하게 할 수 있는데 lableselector를 사용한다.

## nodeSelector

nodeSelector는 가장 간단하고 권장되는 설정이다.
nodeSelector는 PodSpec의 필드이다.

- node에 label 붙이기
```
$ kubectl label nodes gs-hci-vm-auth {lable key}={label value}

example)
$ kubectl label nodes gs-hci-vm-auth app=auth
```

- lable 확인
```
$ kubectl get nodes --show-labels
```

- label 삭제

```
$ kubectl label nodes {nodename} {label-key}-
```

### 예시 gpu가 있는 서버에만 plugin 설정하기

- gpu 노드에 label 달기
```
$ kubectl label nodes {gpu nodename} gpus=true
node/{gpu node name} labeled
```

- nodeselector 추가

```
nodeSelector:
        gpus: "true"
```
예시
```
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nvidia-device-plugin-daemonset-1.12
  namespace: kube-system
spec:
  updateStrategy:
    type: RollingUpdate
  selector:
    matchLabels:
      name: nvidia-device-plugin-ds
  template:
    metadata:
      # Mark this pod as a critical add-on; when enabled, the critical add-on scheduler
      # reserves resources for critical add-on pods so that they can be rescheduled after
      # a failure.  This annotation works in tandem with the toleration below.
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ""
      labels:
        name: nvidia-device-plugin-ds
    spec:
      tolerations:
      # Allow this pod to be rescheduled while the node is in "critical add-ons only" mode.
      # This, along with the annotation above marks this pod as a critical add-on.
      - key: CriticalAddonsOnly
        operator: Exists
      - key: nvidia.com/gpu
        operator: Exists
        effect: NoSchedule
      containers:
      - image: nvidia/k8s-device-plugin:1.11
        name: nvidia-device-plugin-ctr
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]
        volumeMounts:
          - name: device-plugin
            mountPath: /var/lib/kubelet/device-plugins
      volumes:
        - name: device-plugin
          hostPath:
            path: /var/lib/kubelet/device-plugins
      nodeSelector:
        gpus: "true"
```

