## ref
- https://noahlogs.tistory.com/47]
- https://peemangit.tistory.com/7
- https://brownbears.tistory.com/190
- https://m.blog.naver.com/PostView.nhn?blogId=suin2_91&logNo=221233074959&proxyReferer=https:%2F%2Fwww.google.com%2F
- https://noahlogs.tistory.com/47

# 네트워크

네트워크 기술이란 서버와 클라이언트의 정보가 오고 가는 다리 역할을 하는 기술의 총칭을 의미한다.
네트워크라는 말은 연결되어 있다라는 뜻으로 컴퓨터 네트워크는 데이터를 케이블에 실어 나르는 것을 의미한다. (무선 LAN은 전파로 데이터를 실어 나른다.)

## LAN (Local Area Network)

LAN 이란 기업이나 조직 등 비교적 좁은 범위 안에 존재하는 컴퓨터 네트워크를 의미한다. LAN은 LAN 케이블을 이용하여 데이터를 전송하는 유선 LAN과 전파를 이요하여 데이터를 전송하는 무선 LAN으로 구분한다.

## MAN (Metropolitan Area Networks)

MAN은 같은 도시 등과 같이 지리적으로 같은 위치에 있는 여러개의 랜을 연결하는 네트워크이다.

## WAN(wide Area Networks)

WAN은 위에서 설명한 LAN, MAN을 다시 하나로 묶는 거대한 네트워크이다.

## 네트워크 작동 원리

네트워크는 OSI 참조 모델을 바탕으로 작동한다. OSI 참조 모델은 국제표준화기구(ISO)가 컴퓨터 통신 기능을 계층 구조로 나눠서 정리한 모델로 일종의 통신 규칙 모음이라고 생각하면 된다.
보통 OSI 7계층이라고 하는데 하위 계층(물리 게층) 로 부터 상위 계층(전송 계층)으로 구성된다.

## OSI 7계층

- 제 1계층 (물리 계층) : 네트워크 케이블의 재질이나 커넥터의 형식, 핀의 나열 방법 등 물리적인 요소를 모두 규정한다.
- 제 2계층 (데이터 링크 계층) : 직접 연결된 기기 사이에 논리적인 전송로(데이터 링크)를 확립하는 방법을 규전한다.
- 제 3계층 (네트워크 계층) : 동일 또는 다른 네트워크의 기기와 연결하기 위한 주소와 경로의 선택 방법을 규정한다.
- 제 4계층 (전송 계층) : 데이터를 통신할 상대에게 확실하게 전달하는 방법을 규정한다.
- 제 5계층 (세션 계층) : 데이터를 흘려보내는 논리적인 통신로(커넥션)의 확립과 연결 끊기에 대해 규정한다.
- 제 6계층 (표현 계층) : 애플리케이션 데이터를 통신에 적합한 형태로 변환하는 방법을 규정한다.
- 제 7계층 (응용 계층) : 애플리케이션 별로 서비스를 제공하는 방법을 규전한다.

## OSI 7L 와 TCP/IP 4L의 차이

OSI 7Layer는 인터넷 환경(연결 위주)에서 사용하는 네트워크 계층 개념이고
TCP/IP 4Layer는 웹환경(프로토콜 위주)에서 주로 사용하는 네트워크 계층 개념이다.

WWW, FTP, SMTP, TELNET등 인터넷 서비스를 위한 프로토콜이 개발되면서 TCP/IP 개념이 대두외었다.

## 스위치란?

스위치는 처리 가능한 패킷의 숫자가 큰 것으로, 네트워크 단위 들을 연결하는 통신 장비로서 소규모 통신을 위한 허브보다 전송 속도가 개선된 것이다.
Switch는 전통적인 L2 Switch와 Multi Layer Switch(MLS) L3 / L4 / L7 Switch로 구분된다.

## 스위치 구분

LAN Switch : Ethenet Switch / Token ring Switch / FDDI Switch
WAN Switch : x.25 Switch / Frame relay Switch / ATM Switch

WAN 구간의 PPP / HDLC Protocol은 점대점(Point-to-Point)연결이기 때문에 스위치가 필요하지 않다.

## LAN 스위치 방식

Cut-through : Input Frame의 목적지 MAC 주소만 확인한 후 해당 포트로 Frame을 전송한다.
Store-and-Forword : 전체 Frame을 버퍼에 저장한 후 오류 검출 후 해당 포트로 전달한다.
Fragment-Free : Input Frame의 처음 4bit만 보는것이 아닌 512bit를 본다. (위 두개의 장점을 합침)

## Ethernet(L2) Switch와 Router의 차이점

1. Switch

L2 Device이기 때문에 L2 정보인 Ethernet헤더의 목적인 MAC 주소와 MAC Address Table 을 비교하여 출구 포트를 결정한다.
Known Unicast 트래픽은 Forwarding을 처리 하고, Unknown Unicast와 Broadcast 트래픽은 Flooding을 수행한다.

모든 포트는 하나의 공통된 Broadcast Domain(=Network)에 포함되어 있다.
스위치의 주소록인 MAC Address Table은 관리자가 별도의 명령어를 입력하지 않아도 자동으로 생성되고 해당 정보로 통신이 가능하다. (Plug & Play)

2. Router

L3 Device이기 때문에 L3 정보인 IP헤더의 목적지 IP 주소와 자신의 주소인 Routing Table을 비교하여 Best Path(최적 경로)를 결정한다.

Known Unicast 트래픽은 Forwarding 처리를 하고,  Unknown Unicast와 Broadcast 트래픽은 다른 Interface로 전송하지 않는다.
각 Interface는 서로 다른 Broadcast Domain(= Network)을 구분하게 된다.
Router의 주소록인 Routing Table은 관리자가 명령어를 입력해야만 경로 정보가 등록되고, 그 이후부터 통신이 가능하다.

## 스위치, 라우터, 허브의 차이점

리피터, 허브를 레이어 1 장비, 브리지 스위치를 레이어 2 장비, 라우터 L3 스위치를 레이어 3 장비라고 한다. L2 스위치는 그 하위 레이어 장비의 기능을 모두 포함하고 있으면 L3 스위치는 L2스위치 기능을 모두함하고 있다. 따라서, 서로 대체하여 쓸 수 있지만, 문제는 가격이 비싸다는 것이다. 그래서 네트워크 규모에 따라 적절한 장비를 써야 한다.

## 리피터 

상위계층에서 사용하는 MAC주소나 IP주소를 이해하지 못하고 단순히 전기적인 신호만 증폭시키는 역할을 한다.

- 전기적인 신호를 증폭시켜 먼거리 까지 도달할 수 있도록 하는 장비
- 전체 LAN에 접속할 수 있는 장비의 수 증가

## 허브 

전기적인 신호를 증폭시켜 LAN의 전송거리를 연장시키고 여러대의 장비를 LAN에 접속할 수 있도록 한다.
UTP 케이블을 사용하는 환경에서 장비들을 상호 연결시키는 콘센트레이터 역할도 함께 제공한다 
한 장비에서 전송된 데이터 프레임을 허브로 연결된 모든 장비에게 다 전송하는 플러딩이 발생 -> 프레임 충돌 발생 증가, 네트워크 성능 저하 (하프두 플렉스 때문)

## 브리지

허브와 마찬가지로 이더넷 장비를 물리적으로 연결시키고 프레임의 전송거리를 연장 시켜준다. 
단순히 전기적인 신호를 증폭시키는 것이 아니라 프레임을 다시 만들어 전송한다.

## 스위치

MAC 주소와 포트번호가 기록된 MAC 주소 테이블을 가지고 있어 목적지 MAC 주소를 가진 장비가 연결된 포트로만 프레임을 전송한다.

스위치는 각각의 포트가 하나의 충동영역에 있다.

프에임의 목적인 MAC주소가 브로드캐스트일때 수신프레임을 모든 포트로 전송하며 이것을 플러딩이라고 한다.

## 라우터 

IP주소 등 레이어 3 헤더에 있는 주소를 참조하여 목적지와 연결되는 포트로 패킷을 전송한다. 네트워크 주소가 서로 다른 장비들을 연결할 때 사용한다.  또 원격지에 위치한 네트워크들을 연결하는 경우가 많다.
VLAN이 서로 다른 장비들 간의 통신은 L3 스위치, 라우터 등 L3 자입를 통해야만 가능한다.

## L3 스위치

Vlan간 라우팅을 위해 사용한다.
VLAN 포트간 스위칭 기능을 제공하고, 서로 다른 VLAN 포트간에는 라우팅 기능을 제공한다.
라우터보다 라우팅 속도가 빠르지만 장거리 통신망을 연결하는 포트도 있다.

## 프로토콜

프로토콜이란 네트워크 통신을 위한 통신 규칙을 의미한다.
프로토콜의 역할은 데이터의 캡슐화와 캡슐해제화를 하는 것이다. 네트워크 통신에서 OSI 참조 모델의 계층을 넘어설 때마다 데이터를 캡슐에 넣거나 꺼낸다

## 패킷

- 전달해야할 데이터
- 네트워크에게 이 패킷으로 무엇을 해야하는지 알려주는 제어정보를 갖고 있음

## Port Number

- FTP(File Transfer Protocol)  : 21
- Telnet : 23
- SMTP(Simple Mail Transfer) : 25
- DNS(Domain Name Service) : 53
- HTTP(Hyper Text Transfer) : 80
- POP3(Post Office Protoco 3) : 110
- SNMP(Simple Network Management) : 161
- TFTP(Trival File Transfer) : 69
- NNTP(Network News Transfer) : 119

## Networking 명령어

- ipconfig : TCP/IP의 등록정보 및 구성을 알 수 있음
- nbtstat - +nbt=netbios 같은 ip를 쓰는 컴퓨터 주소들을 알 수 있음 (한 ip에 두대 이상의 컴퓨터면 에러)
- nslookup = 도메인 서버에 도메인 이름이나 ip 주소를 질의
- tracert = 목적지까지 가는 라우터의 주소 및 상태를 알 수 있음
- netstat = 외부에서 통신이 안될대 접속되어 있는 Port를 확인
- ping = 속도체크 / 상태체크

## IP (Internet Protocol)

IP는 전송 계층(제 4계층)으로부터 받은 데이터(세그먼트)에 IP 헤더를 붙여 패킷으로 만드는 역할을 한다. IP 헤더에는 여러 필드 값(버전, 헤더길이, 프로토콜등), 출발지 IP주소, 도착지 IP 주소가 들어간다.

IP는 IP 주소라는 32비트로 된 식별번호를 사용하여 컴퓨터를 직별한다.

## 서브넷 마스크란?

서브네팅이란? (Subnetting)


서브넷마스크를 알기 위해선 먼저 서브네팅 개념을 이해해야한다. 서브네팅은 `네트워크 관리자가 네트워크 성능을 향상시키기 위해, 자원을 효율적으로 분배하는 것이다. 여기서 자원을 효율적으로 분배한다는 것은 네트워크 영역과 호스트 영역을 분할하는 것이라고 생각하면된다.` 네트워크적인 측면에서 말하자면, 너무 큰 브로드캐스트 도메인은 네트워크 환경에서 패킷전송을 느리게 하고 성능저하를 발생시킨다. 따라서 네트워크를 쪼개서 통신 성능을 보장하는 것이다.