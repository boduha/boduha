package org.boduha.server;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * A logging interceptor to help observing server activity.
 */
@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    /**
     * 
     */
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingInterceptor.class);

    /**
     * 
     */
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        log.info("Incoming request: {} {}", request.getMethod(), request.getRequestURI());

        return true;
    }
}