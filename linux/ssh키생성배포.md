# ssh 키 생성 배포

ssh키 생성 (instance 1)

-  key gen

-t rsa는 RSA 방식의 암호화 키를 만들겠다는 뜻이다.

```
$ ssh-keygen -t rsa
```

- 체크(instance 1)

성공적으로 생성되었으면 .ssh 디렉터리 안에 id_rsa와 id_rsa.pub 파일이 생성된다.

```
$ ls -al ~/.ssh/
```

- copy(instance 1 - > instance 2)

ssh-copy-id를 사용하면 편하다.
```
$ ssh-copy-id {id}@{instance2 ip}
```

만약 안된다면
scp를 사용해주자
```
$ scp ~/.ssh/id_rsa.pub {id}@{instance2 ip}:~/.ssh/id_rsa.pub
```

그러면 접근시 비밀번호를 입력하지 않아도 된다.

