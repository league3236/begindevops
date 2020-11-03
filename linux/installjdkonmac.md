## ref

- https://findstar.pe.kr/2019/01/20/install-openjdk-by-homebrew/


## OpenJDK

OpenJDK(Open Java Development Kit)는 자바 플랫폼,  스탠더드 에디션 (자바 SE)의 자유-오픈소스 구현체이다. 최근 자바가 유료화 되면서 한층 주목받고 있는데, 
유료화에 대한 반발로 주변의 많은 사람들이 OpenJDK를 설치하는 모습을 볼 수 있었다.  

이때만 해도 OpenJDK그를 공식적인 brew로 설치가 불가능했다. 
지금은 어떨지 모르겠다.

## AdoptOpenJDK

AdoptOpenJDK는 사전에 prebuild 형태로 java binary를 제공하는 커뮤니티 그룹이다. Mac 뿐만 아니라
윈도우, 리눅스 환경도 제공하고 있다. 공식적으로 OpenJDK를 설이하는 것은 직접 빌드해서 사용하는 방법이 있지만, 
빌드 이외에도 자잘한 `JAVA_HOME` 설정 문제라던가 버전업을 편하게 하기 위해서 homebrew를 사용해서 
AdoptOpenJDk를 설치할 수 있다.

자세한 설치방법은 github를 참조한다.(https://github.com/AdoptOpenJDK/homebrew-openjdk)


```
$ brew tap AdoptOpenJDK/openjdk
```

```
$ brew cask install adoptopenjdk8
```

version 확인

```
$ /usr/libexec/java_home -V
```

설치 위치 체크

```
$ /usr/libexec/java_home
/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
```

example
```
Matching Java Virtual Machines (1):
    1.8.0_272, x86_64:	"AdoptOpenJDK 8"	/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home

/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
```

mac에서 위와같이 확인 후 사용할 jdk 버전을 설정가능하다. 

vim ~/.bash_profile
```
export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
```

적용
```
$ source ~/.bash_profile
```

적용된 버전 확인
```
$ java -version
openjdk version "1.8.0_272"
OpenJDK Runtime Environment (AdoptOpenJDK)(build 1.8.0_272-b10)
OpenJDK 64-Bit Server VM (AdoptOpenJDK)(build 25.272-b10, mixed mode)
```
