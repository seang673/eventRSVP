package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String servletPath = request.getServletPath();
        String authHeader = request.getHeader("Authorization");

        System.out.println("RequestURI = " + request.getRequestURI());
        System.out.println("ContextPath = " + request.getContextPath());
        System.out.println("ServletPath = " + servletPath);

        // ✅ Allow public endpoints (NO TOKEN REQUIRED)
        if (servletPath.startsWith("/api/auth/login") ||
            servletPath.startsWith("/api/auth/register") ||
            servletPath.startsWith("/api/public")) {

            System.out.println("BYPASS TRIGGERED for " + servletPath);
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ All other endpoints require a Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        try {
            String token = authHeader.replace("Bearer ", "");

            Long userId = JwtUtil.extractUserId(token);
            boolean isOrganizer = JwtUtil.extractIsOrganizer(token);

            // ✅ Attach user info to request for controllers/services
            request.setAttribute("userId", userId);
            request.setAttribute("isOrganizer", isOrganizer);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token");
        }
    }
}

