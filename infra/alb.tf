resource "aws_lb" "main" {

  name = "booking-alb"

  internal = false

  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
}

resource "aws_lb_target_group" "app" {

  name = "booking-tg"

  port = 8080

  protocol = "HTTP"

  target_type = "ip"

  vpc_id = aws_vpc.main.id

  health_check {

    path = "/actuator/health"

    matcher = "200"

    healthy_threshold   = 2

    unhealthy_threshold = 3

    timeout  = 5

    interval = 30
  }
}

resource "aws_lb_listener" "http" {

  load_balancer_arn = aws_lb.main.arn

  port = 80

  protocol = "HTTP"

  default_action {

    type = "forward"

    target_group_arn = aws_lb_target_group.app.arn
  }
}
