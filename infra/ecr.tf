resource "aws_ecr_repository" "booking_app" {

  name = "booking-system"

  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {

    scan_on_push = true
  }
}