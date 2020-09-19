## ref
- https://noahlogs.tistory.com/47]
- https://peemangit.tistory.com/7

# 네트워크

네트워크 기술이란 서버와 클라이언트의 정보가 오고 가는 다리 역할을 하는 기술의 총칭을 의미한다.
네트워크라는 말은 연결되어 있다라는 뜻으로 컴퓨터 네트워크는 데이터를 케이블에 실어 나르는 것을 의미한다. (무선 LAN은 전파로 데이터를 실어 나른다.)

## LAN (Local Area Network)

LAN 이란 기업이나 조직 등 비교적 좁은 범위 안에 존재하는 컴퓨터 네트워크를 의미한다. LAN은 LAN 케이블을 이용하여 데이터를 전송하는 유선 LAN과 전파를 이요하여 데이터를 전송하는 무선 LAN으로 구분한다 .

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
