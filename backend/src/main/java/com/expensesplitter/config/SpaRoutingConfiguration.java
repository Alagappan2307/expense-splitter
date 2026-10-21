package com.expensesplitter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.web.servlet.function.RouterFunctions.route;

@Configuration
public class SpaRoutingConfiguration {

    @Bean
    public RouterFunction<ServerResponse> spaRouter() {
        Resource index = new ClassPathResource("static/index.html");

        return route(
            request -> {
                String p = request.path();
                return !p.startsWith("/api") && !p.contains(".");
            },
            request -> ServerResponse.ok().contentType(MediaType.TEXT_HTML).body(index)
        );
    }
}
