resource "aws_instance" "app" {
    instance_type       = "t2.micro"
    availability_zone   = "us-east-1a"
    ami                 = "ami-40d28157"

    user_data = <<-EOF
                #!/bin/bash
                sudo service apache2 start
                EOF
}


----


resource "aws_instance" "example" {
    count         = 10
    ami           = "ami-40d28157"
    instance_type = "t2.micro"
}


---

resource "aws_instance" "example" {
    ami           = "ami-40d28157"
    instance_type = "t2.micro"

    user_data     = <<-EOF
                    #!/bin/bash
                    echo "Hello, World" > index.html
                    nohup busybox httpd -f -p 8080 &
                    EOF
    tags {
        Name = "terraform-example"
    }
}
