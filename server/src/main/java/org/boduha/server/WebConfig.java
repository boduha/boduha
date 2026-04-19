package org.boduha.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Application configuration.
 * 
 * Adds an interceptor to ease observing server activity.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * A request logging interceptor.
     */
    @Autowired
    private RequestLoggingInterceptor interceptor;

    /**
     * Adds a server request logging interceptor.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(interceptor);
    }
    
}