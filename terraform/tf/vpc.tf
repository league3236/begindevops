resource "aws_vpc" "dmz" {
    cidr_block           = "10.1.0.0/16"
    enable_dns_support   = true
    enable_dns_hostnames = true

    tags { Name = "DMZ" }
}

resource "aws_vpc" "application" {
    cidr_block           = "10.2.0.0/16"
    enable_dns_support   = true
    enable_dns_hostnames = true

    tags { Name = "Application"}
}