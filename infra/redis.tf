# Redis Subnet Group
resource "aws_elasticache_subnet_group" "redis" {

  name = "${var.project_name}-redis-subnet-group"

  subnet_ids = [
    aws_subnet.private_data_a.id,
    aws_subnet.private_data_b.id
  ]
}

resource "aws_elasticache_replication_group" "redis" {

  replication_group_id = "${var.project_name}-valkey"

  description = "Booking System Valkey"

  engine = "valkey"

  node_type = "cache.t4g.micro"

  num_cache_clusters = 1

  port = 6379

  subnet_group_name = aws_elasticache_subnet_group.redis.name

  security_group_ids = [
    aws_security_group.redis.id
  ]
}