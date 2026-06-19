package com.sagar.bookingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
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
