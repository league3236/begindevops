package main

import "fmt"

const (
	//  iota로 비트 연산의 결과값을 상수로 선언
	Running = 1 << iota
	Waiting
	Send
	Receive
)

func main() {
	//  OR 연산자(|)로 stat 변수 생성
	stat := Running | Send
	// fmt.Println(stat)
	display(stat)
}

func display(stat int) {
	// AND 연산자(&)로 stat에 포함된 비트 값의 상태 출력
	if stat&Running == Running {
		fmt.Println("Running")
	}
	if stat&Waiting == Waiting {
		fmt.Println("Waiting")
	}
	if stat&Send == Send {
		fmt.Println("Send")
	}
	if stat&Receive == Receive {
		fmt.Println("Receive")
	}
}
