resource "aws_ecs_cluster" "main" {

  name = "booking-system-cluster"
}

resource "aws_ecs_task_definition" "app" {

  family = "booking-system"

  requires_compatibilities = [
    "FARGATE"
  ]

  network_mode = "awsvpc"

  cpu    = 512
  memory = 1024

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  task_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([

    {

      name = "booking-app"

      image = "${aws_ecr_repository.booking_app.repository_url}:latest"

      essential = true

      portMappings = [

        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]

      environment = [

        {
          name = "DB_URL"

          value = "jdbc:postgresql://${aws_db_instance.postgres.address}:5432/bookingdb"
        },

        {
          name = "REDIS_HOST"

          value = aws_elasticache_replication_group.redis.primary_endpoint_address
        },

        {
          name  = "REDIS_PORT"
          value = "6379"
        },

        {
          name  = "JAVA_TOOL_OPTIONS"
          value = "-XX:+UseContainerSupport -Xms256m -Xmx768m"
        }
      ]

      secrets = [

        {
          name = "DB_USERNAME"

          valueFrom = aws_secretsmanager_secret.db_username.arn
        },

        {
          name = "DB_PASSWORD"

          valueFrom = aws_secretsmanager_secret.db_password.arn
        }
      ]

      logConfiguration = {

        logDriver = "awslogs"

        options = {

          awslogs-group = aws_cloudwatch_log_group.ecs.name

          awslogs-region = var.aws_region

          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}