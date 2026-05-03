package org.boduha.server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Minimal root endpoint for the Boduha server.
 *
 * <p>
 * Provides a simple response at "/" to confirm the server is running,
 * avoiding a blank page or default error when accessed directly in a browser.
 *
 * <p>
 * This endpoint is not part of the learning flow. In the future, it may
 * redirect to the client application, serve the client directly, or act as
 * a landing page before starting a session.
 */
@RestController
public class HomeController {

    /**
     * Basic health check endpoint.
     *
     * @return a plain text message indicating the server is up
     */
    @GetMapping("/")
    public String home() {
        return "Boduha server is running.";
    }
}