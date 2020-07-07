package main

import "fmt"

func main() {
	array1 := []int{1, 2, 3, 4, 5}
	fmt.Println(solution(array1))
	// array2 := []int{1, 3, 2, 4, 2}
	// fmt.Println(solution(array2))
}

func solution(answers []int) (result []int) {
	idx, score := make([]int, 3), make([]int, 3)
	for i := 0; i < len(answers); i++ {
		for j := 0; j < 3; j++ {
			idx[j]
		}
	}
	return
}
