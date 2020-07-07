package main

import (
	"fmt"
	"math"
)

func add(x int, y int) int {
	return x + y
}

func main() {
	fmt.Printf("Now you have %g problems.\n", math.Nextafter(2, 3))
	fmt.Println(math.Pi)
	fmt.Println(add(42, 13))
}
