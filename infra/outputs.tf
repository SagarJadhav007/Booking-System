output "project_name" {

  value = var.project_name
}

output "environment" {

  value = var.environment
}

output "region" {

  value = var.aws_region
}

output "ecr_repository_url" {

  value = aws_ecr_repository.booking_app.repository_url
}

output "rds_endpoint" {

  value = aws_db_instance.postgres.address
}

output "redis_endpoint" {

  value = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "alb_dns_name" {

  value = aws_lb.main.dns_name
}

output "booking_queue_url" {

  value = aws_sqs_queue.booking_queue.id
}

output "cloudfront_url" {

  value = aws_cloudfront_distribution.frontend.domain_name
}