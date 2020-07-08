# contribution이 내 저장소에 보여지는 방법

최근에 github를 사용하면서 1일 1커밋을 하다가
개인적인 보안정보가 스크린샷을 통해서 github에 업로드되는 문제가 생겼다. 급하게 .gitignore 과 해당 내용을 삭제해서 깃에 업로드하였지만 커밋에는 남아있었고 이것이 문제가 되었다.

꽤나 오랫전에 commit부터 존재했기에 해당 커밋들을 일일이 찾아 지우기는 힘들엇고
```
$ rm --cache 
```
등의 명령어를 사용하기에는 내가 너무 당황한 나머지 
해당 레포지토리를 삭제하고 다시 작성하는 방법을 선택했다.

먼저 레포지토리를 삭제
.git 파일을 삭제했더니

그동안 작성했던 contribution을 통한 잔디밭이 사라졌다.
contribution의 내용들은 gitrepository에 있는 .git 을 참고한다는 것이였다. (참고는 했겠지만 잔디밭또한 전부 종속적일줄은 몰랐다)

github 레포에 대한 기여도에 대해서 알아보겠다.

github 프로필 기여도는 현지 시간대가 아닌 UTC 세계 협정 시간대에 따라 표시가된다. 그리고 특정 기준을 충족해야한다.

## contribution counted

커밋 조건

커밋은 다음 조건은 **모두** 충족해야 contribution counted에 속한다.

- commit에 사용하는 이메일 주소가 github에 연결되어야 한다.

예를들면 나같은 경우에는 다음 명령어를 통해 .git에 내 아이디를 입력해주어야지 커밋시 contribution count에 적용이 된다는 것이다.

```
# git config --local user.email "league3236@gmail.com"
```

해당 정보는
.git/config 파일에 저장된다
```
$ cat .git/config 
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        precomposeunicode = true
[remote "origin"]
        url = https://github.com/league3236/begindevops.git
        fetch = +refs/heads/*:refs/remotes/origin/*
[user]
        name = league3236
        email = league3236@gmail.com
```


- 다음 중 하나 이상에 해당해야한다.
  - repository 공동 작업자거나 소유한 조직의 구성원이여야 한다.
  - default branch(master)나 gh-pages(github page 브랜치)에 기여하는 것
  - 이슈를 만드는 것
  - PR을 만드는 것
  - PR 리뷰를 제출하는 것




## ref
- https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/why-are-my-contributions-not-showing-up-on-my-profile
- https://www.yceffort.kr/2020/01/github-daily-contribution/
