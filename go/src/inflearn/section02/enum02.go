package main

import "fmt"

func main() {
	const (
		A = iota + 1
		B
		C
	)

	fmt.Print(A, B, C)
}
