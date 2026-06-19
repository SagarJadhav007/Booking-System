variable "aws_region" {

  description = "AWS Region"
  type        = string
}

variable "project_name" {

  description = "Project Name"
  type        = string
}

variable "environment" {

  description = "Environment"
  type        = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}