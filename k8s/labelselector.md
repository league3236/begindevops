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

