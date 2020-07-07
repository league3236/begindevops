// section02/ex03

package main

import "fmt"

func main() {
	// 짧은 선언
	// 반드시 함수 안에서만 사용(전역x)
	// 주로 제한된 범위의 함수내에서 사용할 경우 코드 가독성을 높일 수 있다.

	var shortVar1 int = 3
	shortVar2 := "Test"
	shortVar3 := false

	// shortVar3 := true // 예외 발생
	fmt.Println("shortVar1 : ", shortVar1, "shortvar2 : ", shortVar2, "shortvar3 : ", shortVar3)

	// if문에서 많이 쓰임
	if i := 10; i < 11 {
		fmt.Println("Short Variable Test Success!")
	}
}
