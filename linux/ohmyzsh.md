# zsh

shell을 많이쓰다보니 기본 bash가 불편하게 느껴진다.

이때는 zsh 를 사용하도록 하자

## zsh와 oh my zsh

zsh는 bash와 같은 shell 프로그램이다. bash에 비해 강력한 기능을 제공한다.
oh my zsh는 zsh 설정을 관리하기 위한 프레임워크이다. 
200개가 넘는 플러그인과 140개 이상의 테마를 제공한다. 

## install

### ubuntu에 설치

- zsh 설치
```
$ sudo apt install -y zsh
```

- 준비 설정
```
$ sudo apt install -y wget curl git
```

- oh my zsh 설치
```
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

- 테마 수정
vim ~/.zshrc 11번째 줄
에서 ZSH_THEME="테마명"

example
```
ZSH_THEME="agnoster"
```

- 폰트 설치
power-line 폰트 설치
```
$ sudo apt install fonts-powerline
```


# ref 
- https://the-illusionist.me/47
- https://kairos03.github.io/2018/09/10/install-oh-my-zsh.html
