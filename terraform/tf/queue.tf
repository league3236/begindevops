provider "aws" {}

resource "aws_sqs_queue" "ec2_monitor" {
    name           = "ec2-monitor"
    redrive_policy = "{\"deadLetterTargetArn\":\"${aws_sqs_queue.ec2_monitor_dlq.arn}\",\"maxReceiveCount\":3}"

    tags = {
        Team = "engineers"
    }
}

resource "aws_sqs_queue" "ec2_monitor_dlq" {
    name = "ec2-monitor-dlq"

    tags = {
        Team = "engineers"
        Type = "dlq"
    }
}