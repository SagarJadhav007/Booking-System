resource "aws_cloudwatch_log_group" "ecs" {

  name = "/ecs/booking-system"

  retention_in_days = 7
}
