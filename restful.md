
## ref
- https://nesoy.github.io/articles/2017-02/REST
- https://medium.com/@bbirec/http-%EC%BA%90%EC%89%AC%EB%A1%9C-api-%EC%86%8D%EB%8F%84-%EC%98%AC%EB%A6%AC%EA%B8%B0-2effb1bfab12

# RESTful이란?

- REST는 Representation State Transfer라는 용어의 약자로서 `웹의 장점을 최대한 활용할 수 있는 아키텍처`
- 최근의 서버 프로그램은 다양한 브라우저와 안드로이폰, 아이폰과 같은 모바일 디바이스에서도 통신을 할 수 있어야한다.
- REST 아키텍처는 HypermediaAPI의 기본을 충실히 지키면서 범용성을 보장한다.

# REST의 특징

Uniform (유니폼 인터페이스)
- Uniform Interface는 URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍처 스타일

* uri와 url?

URI는 인터넷 상의 자원을 식별하기 위한 문자열의 구성쯤, URL은 URI의 한 형태로 인터넷 상의 자원 위치를 나타낸다.
즉 URL은 URI에 포함된다.

Stateless(무상태성)

- 상태가 있다 없다는 의미는 사용자나 클라이언트의 컨택스트를 서버쪽에서 유지하지 않는다는 의미한다.
- 세션이나 쿠키등을 별도로 관리하지 않기 때문에 API서버는 요청만을 들어오는 메시지로만 처리하기 때문에 구현이 단순하다.

Cacheable(캐시 처리 가능)

- REST의 가장 큰 특징 중 하나는 HTTP라는 기존 웹표준을 그대로 사용한다.
- HTTP가 가진 캐싱 기능이 적용 가능하다. HTTP 프로토콜 표준에서 사용하는 Last-Modified태그나 E-Tag를 이용하면 캐싱 구현이 가능하다.

* HTTP 캐쉬로 API 속도 올리기

API와 같은 Dynamic Content에도 간단하게 Cache 기능을 사용하게 설정하면 API 속도도 증가되고 유저 입장에서는 네트웍 트래픽을 줄일 수 있다.

- HTTP Cache

HTTP Cache는 크게 보면 세가지로 나눌 수 있는데, 공통적으로 Response Header에 어떻게 넣느냐에 따라 다르게 동작한다 이 세가지 방식을 정확히 이해하지 않고 사용하게 되면 최악의 경우 유저가 새로운 데이터가 있어도 이전 데이터만 받아오게 될 수 있다.

1. Cache control + Expire

```
Cache-Control: public, max-age=31536000
```

이 방식은 max-age시간 동안 브라우저가 캐쉬를 해도 무방하다고 알려주는 Cache방식인데, 브라우져 입장에서는 max-age 기간 동안 아예 서버를 요청 안할 수 있다. API의 경우 언제 새로운 데이터가 포함될지 모르기 때문에 이 방식을 사용할 수 없다.


2. Last Modified

```
Last-Modified: Mon, 03 Jan 2011 17:45:57 GMT
```

API의 내용이 마지막으로 변경된 시간을 Response로 주게 되면, 웹브라우져에서는 다음에 동일한 API를 Call하는 경우 아래와 같은 Request Headerfmf cnrkotj qhsorp ehlsek.

```
If-Modified-Since: Mon, 03 Jan 2011 17:45:57 GMT
```

그럼 API 핸들러에서 마지막으로 변경된 시간을 체크해서 아직 안바뀐 경우 304 Status 코드를 주면 웹 브라우져가 이전에 Cache 되었던 데이터를 사용하게 된다. 

만약 DB에서 마지막 변경된 시간을 관리하고 있다면 이 방식을 사용하면 된다.

3. Etag

Etag 방식을 Last-Modified 방식과 겅의 동일한데, 시간 대신 Hash 값을 사용한다는 측면에서 다르다. Response 데이터의 MD5 Hash를 보통 사용하며, Last-Modified 보다 좀 더 유연하게 적용 가능해서 더 좋은 방식이라고 볼 수 있다.

```
Etag: "15f0fff99ed5aae4edffdd6496d7131f"
```

Response에 다음과 같은 Etag 헤더를 추가해주면, 다음 동일한 API를 부르면 아래와 같은 Request 헤더에 체크하는 헤더가 추가된다

```
If-None-Match: "15f0fff99ed5aae4edffdd6496d7131f"
```

Last-Modified와 동일하게 서버에서 같은 ETag를 가지고 있다면 304를 리턴해주면 된다.

`위 세가지 방식 중 Last-Modified, Etag 만 API에 적용가능하다`

API 데이터의 MD5 Hash를 ETag로 사용하게 되면 DB 부하를 줄일 순 없지만, Response 시간을 줄이는데 도움이 될 수 있다.

1. API 핸들러 처리(DB query)
2. 결과 Json에 MD5 Hash
3. If-None-Match 헤더에 잇는 값과 hash값을 비교
4. 만약 동일하다면 304로 리턴
5. 다르다면 200에 결과 Json 리턴

Self-Descriptieness(자체 표현 구조)

- REST의 또 다른 큰 특징 중 하나는 REST API 메시지만 보고도 이를 쉽게 이해 할 수 있는 자체 표현 구조로 되어있다는 것

Client-Server Architecture(클라이언트 - 서버 구조)

- REST 서버는 API를 제공하고, 제공된 API를 이용해서 비즈니스 로직 처리 및 저장을 책임진다.
- 클라이언틍의 경우 사용자 인증이나 컨택스트(세션, 로그인 정보)등을 직접 관리하고 책임진다.
- 서로간의 의존성이 줄어들게 된다.

계층형 구조

- 클라이언트 입장에서 REST API 서버만 호출한다.
- REST 서버는 다중 계층으로 구성될 수 있다. 예를 들어 보안, 로드밸런싱, 암호화 사용자 인증 등등을 추가하여 구조상의 유연성을 줄 수 있다.

REST 구성
- 자원(Resource) - URI
- 행위(Verb) - HTTP Method (GET, PUT, POST, DELETE 등등)
- 표현(Respresentations)

REST API 디자인 가이드

- URI는 Resource를 표현해야 한다.
- Resource에 대한 행위는 HTTP Method(GET, PUT, POST, DELETE 등등)로 표현한다.

1. REST API 중심 규칙

1.1 URI는 정보의 자원을 표현해야 한다.

```
GET /course/insert/inform -- X
GET /Course/inform -- O
```

- HTTP Method (GET, PUT, POST, DELETE 등등)의 행위가 URI 표현으로 들어가서는 안된다.

1.2 자원에 대한 행위는 HTTP Method(GET,PUT,POST, DLETE 등등)로 표현

```
DELETE /members/1
```

- HTTP Method(GET, PUT, POST, DELETE등등)로 행위로 CRUD를 할 수 있다.

CRUD : 소프트웨어(Software)가 가지는 기본적인 데이터 처리 기능을 묶어서 일컫는 말

- 생성(Create)
- 읽기(Read)
- 갱신(Update)
- 삭제(Delete)

