package main

import "fmt"

func main() {
	array1 := []int{1, 2, 3, 4, 5}
	fmt.Println(solution(array1))
	array2 := []int{1, 3, 2, 4, 2}
	fmt.Println(solution(array2))
}

func solution(answers []int) []int {
	answer := []int{}

	list1 := [5]int{1, 2, 3, 4, 5}
	list2 := [8]int{2, 1, 2, 3, 2, 4, 2, 5}
	list3 := [10]int{3, 3, 1, 1, 2, 2, 4, 4, 5, 5}

	correct := [3]int{0, 0, 0}
	for i, v := range answers {
		if v == list1[i%len(list1)] {
			correct[0]++
		}
		if v == list2[i%len(list2)] {
			correct[1]++
		}
		if v == list3[i%len(list3)] {
			correct[2]++
		}
	}

	min := 0
	for i, e := range correct {
		if i == 0 || e > min {
			min = e
		}
	}

	for i, e := range correct {
		if e == min {
			answer = append(answer, i+1)
		}
	}
	return answer
}
