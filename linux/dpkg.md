# dpkg

dpkg는 데비안 패키지 관리 시스템의 기초가 되는 소프트웨어이다. dpkg 명령어가 .deb 패키지의 설치, 삭제, 정보 제공을 위해 사용된다.

dpkg 그 자체는 저레벨의 도구이며 apt와 같은 고급 도구들이 복잡한 패키지 관계와 패키지 원격에서 받아오는 등의 일을 한다. 앱티튜드 (Aptitude), 시냅팁(Synaptic)등이 dpkg 자체보다 많이 쓰이는데, 패키지의존성을 다루는 더 많은 방법과 더 이해하기 편한 인터페이스를 갖고 있기 때문이다.

데비안 패키지 "dpkg"는 **dpkg** 프로그램과 더불어 패키징 시스템이 작동하게 하는 dpkg-statoverride, dpkg-divert, dpkg-trigger and update-alternatived 이외 몇몇 프로그램을 설치한다.

즉, dpkg란 데비안 패키지 관리 시스템의 기초가 되는 소프트웨어이다.

dpkg 명령어가 .deb 패키지의 설치, 삭제, 정보 제공을 위해 사용된다.
dpkg 그 자체는 저레벨의 도구이며 APT와 같은 고급 도구들이 복잡한 패키지 관계와 패키지를 원격에서 받아오는 등의 일을 한다.

## command

- 패키지에 대한 정보 보기

```
$ dpkg --info file_name
```

- 패키지에 들어있는 파일 보기
$ dpkg --contents file_name

- 패키지 설치하기
$ dpkg -i file_name

- 패키지를 풀어헤치기만 하고 설정하지 않기
$ dpkg --unpack file_name

- --unpack으로 풀어헤친 패키지를 설정하기
$ dpkg --configure file_name

- 패키지 삭제하기
$ dpkg --remove package_name

- 설정파일까지 삭제하기
$ dpkg --purge package_name

- 패키지 내의 파일 검색
$ dpkg -L package_name

- 어떤 파일이 어떤 패키지에 들어있는지 알고자 할 때
$ dpkg -S 패턴

- 설치된 패키지 리스트보기
$ dpkg -l



# REF

- https://ko.wikipedia.org/wiki/Dpkg
- https://mjson.tistory.com/160