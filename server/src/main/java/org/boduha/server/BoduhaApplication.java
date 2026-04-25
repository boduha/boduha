package org.boduha.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Boduha server.
 *
 * <p>
 * Boduha is a learning tool focused on practicing number representation
 * (e.g., decimal to binary, patterns, parity). This server provides the
 * question flow, evaluates answers, and maintains per-user session state.
 */
@SpringBootApplication
public class BoduhaApplication {

	/**
	 * Starts the Boduha server.
	 * 
	 * @param args optional command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(BoduhaApplication.class, args);
	}

}
