// 수포자는 수학을 포기한 사람의 준말입니다. 수포자 삼인방은 모의고사에 수학 문제를 전부 찍으려 합니다. 수포자는 1번 문제부터 마지막 문제까지 다음과 같이 찍습니다.

// 1번 수포자가 찍는 방식: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...
// 2번 수포자가 찍는 방식: 2, 1, 2, 3, 2, 4, 2, 5, 2, 1, 2, 3, 2, 4, 2, 5, ...
// 3번 수포자가 찍는 방식: 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, ...

// 1번 문제부터 마지막 문제까지의 정답이 순서대로 들은 배열 answers가 주어졌을 때, 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 return 하도록 solution 함수를 작성해주세요.

package main

import "fmt"

func main() {
	array1 := []int{1, 2, 3, 4, 5}
	fmt.Println(solution(array1))
	array2 := []int{1, 3, 2, 4, 2}
	fmt.Println(solution(array2))
}

func solution(answers []int) []int {
	list1 := []int{1, 2, 3, 4, 5}
	list2 := []int{2, 1, 2, 3, 2, 4, 2, 5}
	list3 := []int{3, 3, 1, 1, 2, 2, 4, 4, 5, 5}
	var a, b, c, max int
	var answer []int

	for i := 0; i < len(answers); i++ {
		if answers[i] == list1[i%len(list1)] {
			a = a + 1
		}
		if answers[i] == list2[i%len(list2)] {
			b = b + 1
		}
		if answers[i] == list3[i%len(list3)] {
			c = c + 1
		}
	}

	max = Max(a, b, c)

	if max == a {
		answer = append(answer, 1)
	}
	if max == b {
		answer = append(answer, 2)
	}
	if max == c {
		answer = append(answer, 3)
	}

	return answer
}

func Max(a, b, c int) int {
	var max int = a
	if a < b {
		max = b
	} else if b < c {
		max = c
	} else if c < a {
		max = a
	}
	return max
}
