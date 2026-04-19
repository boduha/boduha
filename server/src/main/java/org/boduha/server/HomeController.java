package org.boduha.server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Home controller.
 */
@RestController
public class HomeController {

    /**
     * 
     * @return
     */
    @GetMapping("/")
    public String home() {
        return "Boduha server is running.";
    }
}