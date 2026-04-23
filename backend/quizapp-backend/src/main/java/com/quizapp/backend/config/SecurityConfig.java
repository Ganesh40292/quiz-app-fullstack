package com.quizapp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // ✅ Disable CSRF (for testing APIs)
            .csrf(csrf -> csrf.disable())

            // ✅ Allow all requests (for now)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            // ✅ Disable default login form
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}