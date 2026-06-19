resource "aws_secretsmanager_secret" "db_username" {

  name = "booking-db-username"
}

resource "aws_secretsmanager_secret_version" "db_username" {

  secret_id = aws_secretsmanager_secret.db_username.id

  secret_string = var.db_username
}

resource "aws_secretsmanager_secret" "db_password" {

  name = "booking-db-password"
}

resource "aws_secretsmanager_secret_version" "db_password" {

  secret_id = aws_secretsmanager_secret.db_password.id

  secret_string = var.db_password
}