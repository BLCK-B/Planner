package com.blck.edge_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.WatchEvent;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@RestController
public class EdgeServiceApplication {

	public EdgeServiceApplication(WebClient.Builder webClientBuilder) {
		this.webClientBuilder = webClientBuilder;
	}

	public static void main(String[] args) {
		SpringApplication.run(EdgeServiceApplication.class, args);
	}

	public record Task(
			String name,
			String date,
			String type,
			String description,
			String key,
			String[] tags
	) { }

	@GetMapping("/getTasks")
	public Flux<Task> getTasksHardcoded() {
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

	private final WebClient.Builder webClientBuilder;

	private final String centralPersistenceServiceURL = "http://localhost:8081";

	@GetMapping("/loadItems")
	public Flux<Task> loadItems() {
		final String url = centralPersistenceServiceURL + "/users";
		return webClientBuilder.build()
				.get()
				.uri(url)
				.retrieve()
				.bodyToFlux(Task.class);
	}

	@PostMapping("/saveItem")
	public Mono<Task> saveItem(@RequestBody Task task) {
		Task hardcoded = new Task("Learn", "2025-01-25", "deadline", null, "1", new String[]{});
		final String url = centralPersistenceServiceURL + "/users";
		return webClientBuilder.build()
				.post()
				.uri(url)
				.bodyValue(hardcoded)
				.retrieve()
				.bodyToMono(Task.class);
	}

}

