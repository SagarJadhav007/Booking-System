package com.sagar.bookingsystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableRedisRepositories(
        basePackages = "com.sagar.bookingsystem.redis"
)
public class RedisConfig {
}