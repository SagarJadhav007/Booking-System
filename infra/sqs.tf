resource "aws_sqs_queue" "booking_queue" {

  name = "booking-confirmation-queue"

  visibility_timeout_seconds = 30

  message_retention_seconds = 345600
}