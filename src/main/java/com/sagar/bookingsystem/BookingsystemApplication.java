package com.sagar.bookingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import java.util.TimeZone;

@SpringBootApplication
@EnableMethodSecurity
@EnableScheduling
public class BookingsystemApplication {

	public static void main(String[] args) {

		System.out.println(
				"Current Timezone = " +
						TimeZone.getDefault().getID()
		);
		SpringApplication.run(BookingsystemApplication.class, args);
	}

}
