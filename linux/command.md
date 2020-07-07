# linux command list

- 포트 사용하는 프로세스 체크
```
$netstat -ntlp | grep :2377
```
# git

- git config set
```
$git config --local user.name "league3236"
$git config --local user.email "league3236@gmail.com"
```

# awk

awk는 파일로부터 레코드를 선택하고, 선택된 레코드에 포함된 값을 조작하거나 데이터화하는 것을 목적으로 사용하는 프로그램이다. 

즉, awk 명령의 입력으로 지정된 파일로부터 데이터를 분류한 다음, 분류된 텍스트 데이터를 바탕으로 패턴 매칭 여부를 검사하거나 데이터 조작 및 연산 등의 액션을 수행하고, 그 결과를 출력하는 기능을 수행한다.

- 텍스트 파일의 전체 내용 출력
- 파일의 특정 필드만 출력
- 특정 필드에 문자열을 추가해서 출력
- 패턴이 포함된 레코드 출력
- 특정 필드에 연산 수행 결과 출력
- 필드 값 비교에 따라 레코드 출력

>awk [option...] [awk program] [argument..]

- file.txt의 모든 레코드 출력
```
$ awk '{ print }' ./file.txt
```

- file.txt에서 p를 포함하는 레코드 출력
```
$ awk '/p/' ./file.txt
```

- 길이가 10 이상인 경우, 세 번째($3), 네번째($4), 다섯번째($5) 필드를 출력
```
$ awk 'length($0) > 10 { print $3, $4, $5} ' ./file.txt
```

- 두번째 필드값 출력
```
$ awk '{ print $2 }' ./file.txt
```

- 첫번째, 두번째 필드 값 출력
```
$ awk '{ print $1, $2 }' ./file.txt
```

- 레코드 출력
```
$ awk '{ print $0}' ./file.txt
```

- 필드 값에 임의 문자열을 같이 출력
```
$awk '{print "no:"$1, "user:"$2}' ./file.txt
```

- 지정된 문자열을 포함하는 레코드만 출력

awk 의 패턴에 정규 표현식(Regular Expression)을 사용하여 문자열 패턴을 검사할 수 있다. 이 때, 정규 표현식은 "/regex/" 형태로 지정할 수 있다.
```
$ awk '/pp/' ./file.txt         # "pp" 가 포함된 레코드만 유효
$ awk '/[2-3]0' ./file.txt      # 20, 30 이 포함된 레코드만 유효
```

# jq

jq는 JSON 포맷의 데이터를 다루는 커맨드라인 유틸리티이다.

- jq 설치
```
mac
$ brew install jq

리눅스에서는 각 배포판 별 패키지 관리자를 사용해 설치가능하다.
$ apt-get install jq    # debian or ubuntu
$ dnf install jq        # OpenSUSE
```

# 인증서 복사

- ssh 구동 확인
```
$ eval $(ssh-agent)
```

- 인증서 만들기
```
$ssh-keygen -t rsa
```

- 인증서 확인 (id_rsa, id_rsa.pub)
```
$ ls ~/.ssh/
authorized_keys  id_rsa  id_rsa.pub
```

- 인증서 원격 서버에 복사
```
$ssh-copy-id -i ~/.ssh/id_rsa.pub {원격id}@{원격ip}
```

- 확인해보기(비밀번호 입력없이 접근해야 함)
```
$ssh {원격id}@{원격ip}
```

## ref
- https://recipes4dev.tistory.com/171
- https://www.44bits.io/ko/post/cli_json_processor_jq_basic_syntax