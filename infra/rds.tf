# RDS Subnet Group
resource "aws_db_subnet_group" "main" {

  name = "${var.project_name}-db-subnet-group"

  subnet_ids = [
    aws_subnet.private_data_a.id,
    aws_subnet.private_data_b.id
  ]

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# PostgreSQL RDS
resource "aws_db_instance" "postgres" {

  identifier = "${var.project_name}-postgres"

  engine         = "postgres"
  engine_version = "17.10"

  instance_class = "db.t3.micro"

  allocated_storage = 20

  db_name  = "bookingdb"

  username = var.db_username
  password = var.db_password

  db_subnet_group_name = aws_db_subnet_group.main.name

  vpc_security_group_ids = [
    aws_security_group.rds.id
  ]

  publicly_accessible = false

  skip_final_snapshot = true

  deletion_protection = false

  performance_insights_enabled = false

  backup_retention_period = 0

  multi_az = false
}