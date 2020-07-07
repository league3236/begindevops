package main

import (
	"fmt"
	"time"
)

func main() {
	// var x int = 42
	x := 42
	fmt.Println(x)

	// var s, t string = "foo", "bar"
	s, t := "foo", true
	fmt.Println(s)
	fmt.Println(t)

	// take address
	fmt.Println(&s)

	fmt.Println("Hello, World")
	fmt.Println("The time is", time.Now())

}
