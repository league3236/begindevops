package main

import "fmt"

func main() {
	type Rect struct {
		width  int //width
		height int //height
	}

	r := Rect{1, 2}
	fmt.Println(r.width*2 + r.height*2)
}
