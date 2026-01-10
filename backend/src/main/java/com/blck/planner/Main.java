package com.blck.planner;

import io.sentry.Sentry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

	static void main(String[] args) {
		Sentry.init();
		SpringApplication.run(Main.class, args);
	}

}
