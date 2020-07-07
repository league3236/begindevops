package main

import "fmt"

func main() {
	// sum := 0

	// for i := 0; i < 10; i++ {
	// 	sum += i
	// }
	// // fmt.Println(sum)

	// sum1 := 1
	// sum2 := 0
	// for sum1 < 1000 {
	// 	sum2 += sum1
	// 	sum1++
	// 	// fmt.Println(sum1)
	// }
	// fmt.Println(sum2)

	// sum, i := 0, 0
	// // for 문에 조건식 생략
	// for {
	// 	if i >= 10 {
	// 		break
	// 	}

	// 	sum += i
	// 	i++
	// }
	// fmt.Println(sum)

	// switch 문 case에 조건식 사용

	c := 'a'
	switch {
	case '0' <= c && c <= '9':
		fmt.Printf("%c은(는) 숫자입니다", c)
	case 'a' <= c && c <= 'z':
		fmt.Printf("%c은(는) 소문자입니다", c)
	case 'A' <= c && c <= 'Z':
		fmt.Printf("%c은(는) 대문자입니다", c)
	}
}
