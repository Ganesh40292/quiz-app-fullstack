package com.quizapp.backend.config;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitingFilter.class);

    private static final int MAX_QUESTION_SUBMISSIONS_PER_MINUTE = 10;
    private static final int MAX_AUTH_ATTEMPTS_PER_MINUTE = 20;

    private final Map<String, RequestBucket> questionRateLimitMap = new ConcurrentHashMap<>();
    private final Map<String, RequestBucket> authRateLimitMap = new ConcurrentHashMap<>();

    private static class RequestBucket {
        long windowStart;
        final AtomicInteger count = new AtomicInteger(0);

        RequestBucket(long windowStart) {
            this.windowStart = windowStart;
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = getClientIp(request);

        // 1. Rate limiting for question creation (/api/admin/add)
        if ("POST".equalsIgnoreCase(method) && path.endsWith("/api/admin/add")) {
            if (isRateLimited(clientIp, questionRateLimitMap, MAX_QUESTION_SUBMISSIONS_PER_MINUTE)) {
                logger.warn("Rate limit triggered for question submission from IP: {}", clientIp);
                respondWithRateLimitError(response, "Rate limit exceeded. Maximum 10 questions per minute allowed.");
                return;
            }
        }

        // 2. Rate limiting for authentication (/api/auth/login or /api/auth/register)
        if ("POST".equalsIgnoreCase(method) && (path.contains("/api/auth/login") || path.contains("/api/auth/register"))) {
            if (isRateLimited(clientIp, authRateLimitMap, MAX_AUTH_ATTEMPTS_PER_MINUTE)) {
                logger.warn("Rate limit triggered for authentication attempts from IP: {}", clientIp);
                respondWithRateLimitError(response, "Too many authentication requests. Please try again after 1 minute.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String key, Map<String, RequestBucket> map, int maxLimit) {
        long now = System.currentTimeMillis();
        long oneMinuteAgo = now - 60_000L;

        // Periodic cleanup of stale entries if map grows
        if (map.size() > 5000) {
            map.entrySet().removeIf(entry -> entry.getValue().windowStart < oneMinuteAgo);
        }

        RequestBucket bucket = map.compute(key, (k, existing) -> {
            if (existing == null || existing.windowStart < oneMinuteAgo) {
                RequestBucket newBucket = new RequestBucket(now);
                newBucket.count.set(1);
                return newBucket;
            }
            existing.count.incrementAndGet();
            return existing;
        });

        return bucket.count.get() > maxLimit;
    }

    private String getClientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        // Only inspect X-Forwarded-For if the direct connection originates from a local proxy/reverse proxy
        if ("127.0.0.1".equals(remoteAddr) || "0:0:0:0:0:0:0:1".equals(remoteAddr)) {
            String xfHeader = request.getHeader("X-Forwarded-For");
            if (xfHeader != null && !xfHeader.isEmpty() && !"unknown".equalsIgnoreCase(xfHeader)) {
                return xfHeader.split(",")[0].trim();
            }
        }
        return remoteAddr != null ? remoteAddr : "unknown";
    }

    private void respondWithRateLimitError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(429); // 429 Too Many Requests
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"status\":\"fail\",\"message\":\"%s\"}", message));
    }
}
