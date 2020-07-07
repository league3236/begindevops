package main

import "fmt"

func main() {
	i := 2

	// switch i {
	// case 1:
	// 	fmt.Println("i는 1보다 작거나 같습니다.")
	// 	fallthrough
	// case 2:
	// 	fmt.Println("i는 2보다 작거나 같습니다.")
	// 	fallthrough
	// case 3:
	// 	fmt.Println("i는 3보다 작거나 같습니다.")
	// }

	switch {
	case i < 0:
		fmt.Println(i, "는 음수입니다.")
	case i == 0:
		fmt.Println(i, "는 0입니다.")
	case i > 0:
		fmt.Println(i, "는 양수입니다.")
	}
}
