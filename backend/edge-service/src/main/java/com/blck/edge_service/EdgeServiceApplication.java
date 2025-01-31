package com.blck.edge_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@RestController
public class EdgeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EdgeServiceApplication.class, args);
	}

	@GetMapping("/getTasks")
	public Flux<Task> getTasks() {
		List<Task> tasks = Arrays.asList(
				new Task("Learn", "2025-01-25", "deadline", null, "1", new String[]{}),
				new Task("Walk", "2025-02-01", "deadline", null, "2",  new String[]{}),
				new Task("Drink", "2025-02-05", "deadline", null, "3",  new String[]{}),
				new Task("Achieve", null, "long-term", null, "4",  new String[]{}),
				new Task("Win", null, "long-term", "In order to win you must not lose. How smart.", "5",  new String[]{}),
				new Task("Reach", null, "long-term", null, "6",  new String[]{})
		);
		return Flux.fromIterable(tasks);
	}

	public record Task(
			String name,
			String date,
			String type,
			String description,
			String key,
			String[] tags
	) { }

}

