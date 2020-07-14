# k8s command

- kubectl apply
```
$ kubectl apply -f {yamlfile}
```

- kubectl delete
```
$ kubectl delete -f {yamlfile}
```

- kubectl run을 통한 컨테이너 실행
```
$ kubectl run {deployment name} --image {container image} --port=80

example)

$ kubectl run nginx-app --image nginx --port=80
```

- deployment를 이용한 pod 늘리기
```
$ kubectl scale deploy nginx-app --replicas=2
```

- deployments 확인
```
$ kubectl get deployments
```

- 모든 deployment 나열
```
$ kubectl get deployments --all-namespaces
```

- deployment 삭제
```
$ kubectl delete -n {NAMESPACE} deployment {DEPLOYMENT_NAME}

example)

$ kubectl get deployments --all-namespaces
NAMESPACE     NAME               READY   UP-TO-DATE   AVAILABLE   AGE
default       nginx-deployment   1/1     1            1           13d
kube-system   coredns            0/2     2            0           13d

$ kubectl delete -n default deployment nginx-deployment
deployment.apps "nginx-deployment" deleted
```

- 클러스터 노드 세부 정보
```
$ kubectl get nodes -o wide
```

- 클러스터 노드들의 내부 IP 얻기
```
$ kubectl get nodes -o wide --no-headers | awk '{print $6}'
```


- [노드 drain](https://discuss.kubernetes.io/t/not-able-to-join-node-to-master/7123/6)
```
$ kubectl drain {node-name} --ignore-daemonsets --delete-local-data
```

- node delete
```
$kubectl delete node {node-name}
```

- node join 해제
```
$ kubeadm reset
```

- master token 발급
```
$ kubeadm token create
```

- token 확인
```
$ kubeadm token list
```

- sha256 발급
```
$ openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

- kube join
```
$ kubeadm join {masterip} --token {token value} --discovery-token-ca-cert-hash sha256:{sha256 value}
```

- certificate-key 발급
```
$ kubeadm alpha certs certificate-key
```

- certifiacte 업로드
```
$kubeadm init phase upload-certs --upload-certs
```

```
kubeadm join {ip}:6443 --token {token} --discovery-token-ca-cert-hash sha256:{sha-key} --control-plane --certificate-key {certificate-key}
```

- kube 삭제
```
$ kubeadm reset
$ sudo apt-get purge kubeadm kubectl kubelet kubernetes-cni kube*
$ sudo apt-get autoremove
$ sudo rm -rf ~/.kube
```

## ref
- 도서 쿠버네티스 입문(90가지 예제로 배우는 컨테이너 관리 자동화 표준)
- https://arisu1000.tistory.com/27845