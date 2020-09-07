
# service 

일반적으로 ingress를 알기전에 service 라는 개념부터 알아야한다.
서비스는 쿠버네티스 클러스터 안에서 파드의 집합에 대한 경로나 service discovery를 제공하는 리소스다. 서비스의 대상이 되는 pod는 서비스에서 정의하는 label selector로 정해진다.

```
apiVersion: v1
kind: Service
metadata:
  name: sample-service
spec:
  selector:
    app: springboot-web
  ports:
  - port: 80
    protoco: TCP
    targetPort: 8080
```

위는 Service의 매니페스트 파일이다. selector를 통해 띄운 pod를 참조하고 있다. 그리고 해당 서비스는 80 포트로 노출시키고 프로토콜은 TCP이다.  해당 서비스로 들어온 요청은 8080 포트로 포워딩하고 있다.

하지만 이 서비스는 아직 외부 서비스에 노출되고 있지 않다.
External-ip를 보면 아직 할당되지 않았다. 이 말은 클러스터 내부에서만 이 서비스에 접근 가능하다는 것이다. 그렇다면 이 서비스를 어떻게 노출시킬까?

# ingress

일반적으로, 네트워크 트래픽은 Ingress와 egress로 구분된다.
Ingress는 외부로부터 서버 내부로 유입되는 네트워크 트래픽을, egress는 서버 내부에서 외부로 나가는 트래픽을 의미한다.

클러스터 외부에서 내부로 접근하는 요청들을 어떻게 처리할지 정의해둔 규칙들의 모음

쿠버네티스의 서비스는 L4레이어로 TCP 단에서 Pod들을 밸런싱한다.
서비스의 경우에는 TLS(SSL)이나, VirtualHost와 같이 여러 호스트명을 사용하거나 호스트명에 대한 라우팅이 불가능하고, URL Path에 따른 서비스간 라우팅이 불가능하다.

또한, 마이크로서비스 아키텍쳐(MSA)의 경우에는 쿠버네티스의 서비스 하나가 MSA의 서비스로 표현되는 경우가 많고, 서비스는 하나의 URL로 대표되는 경우가 많다.

그래서 MSA 서비스간의 라우팅을 하기 위해서는 API 게이트웨이를 넣는 경우가 많은데, 이 경우에는 API 게이트웨이에 대한 관리포인트가 생기기 때문에, URL 기반의 라우팅 정도라면, API 게이트처럼 무거운 아키텍처 컴포넌트가 아니라, L7 로드밸런서 정도로 위의 기능을 모두 제공이 가능하다.

쿠버네티스에서 HTTP(S) 기반의 L7 로드밸런싱 기능을 제공하는 컴포넌트를 Ingress라고 한다.

Ingress는 클러스터 외부에서 내부로 접근하는 요청들을 어떻게 처리할지 정의해둔 규칙들의 모음이다. 외부에서 접근가능한 URL을 사용할 수 있게 하고, 트래픽 로드밸런싱 해주고, SSL 인증서 처리도 해주고, 도메인 기반으로 가상 호스팅을 제공하기도 한다. Ingress 자체는 이런 규칙들을 정의해둔 자원이고 이런 규칙들을 실제로 동작하게 해주는게 **Ingress Controller**이다.

클라우드 서비스를 사용하게 되면 별 다른 설정없이 각 클라우드 서비스에서 자사의 로드밸런서 서비스들과 연동해서 Ingress를 사용할 수 있게 해준다. 클라우드 서비스를 사용하지 않고 직접 쿠버네티스 클러스터를 구축해서 사용하는 경우라면 Ingress Controller를 직접 Ingress와 연동해주어야 한다.
이때 가장 많이 사용되는것이 쿠버네티스에서 제공하는 Ingress-nginx이다.

## Ingress와 Ingress Controller

Ingress는 여러가지 구현체가 존재한다.
구글 클라우드의 경우 글로벌 로드밸런서를, 오픈소스 구현체로는 nginx기반의 Ingress 구현체가 있다. 상용 제품으로는 F5 BIG IP Controller가 현재 사용이 가능하고, 오픈소스 API 게이트웨이 솔루션이 Kong이 Ingress 컨트롤러의 지능을 지원한다.

쿠버네티스에서 Ingress를 사용하기 위해서는 두 가지가 필요하다. 첫 번째는 YAML 파일에서 [kind: Ingress]로 정의되는 Ingress 오브젝트이고, 두 번째는 Ingress규칙이 적용된 Ingress Controller이다. Ingress를 정의하는 YAML 파일은 아래와 같이 작성될 수 있다.

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: {호스트명}
    http:
      paths:
      - path: /api/hostname-service
        backend:
          serviceName: hostname-service
          servicePort: 80
```

Ingress를 정의하는 YAML 파일은 매우 간단하다. {호스트명} 으로 접근하는 네트워크 요청에 대해서 Ingress 규칙을 적용하되, http 프로토콜을 통해 /api/hostname-service 라는 경로로 접근하는 요청을 hostname-service라는 이름의 Service의 80 포트로 전달하라는 뜻이다. 

그러나 위의 YAML 파일로 Ingres를 생성해도 아무 일도 일어나지 않는다. Ingress는 단지 Ingress 규칙을 정의하는 선언적인 오브젝트일 분 외부 요청을 받아들이는 실제 서버가 아니기 때문이다. Ingress는 Ingress Controller라고 하는 특수한 서버 컨테이너에 적요되어야만 Ingress 에 적용된 규칙이 활성화 된다. 

- Ingress Controller

Ingress Controller를 직접 운영할지, 클라우드 플랫폼에 위임할지에 따라서 고민할 필요가 있다. 직접 Ingress Controller를 구동하려면 Nginx Ingress Controller를 사용할 수 있고, 클라우드 플랫폼에 위임하려면 GKE의 기능을 사용 가능하다.




## ref
- https://blog.naver.com/alice_k106/221502890249
- https://arisu1000.tistory.com/27840
- https://bcho.tistory.com/1263
- https://coding-start.tistory.com/309