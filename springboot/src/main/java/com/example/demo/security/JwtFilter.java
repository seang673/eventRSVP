package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;

import java.io.IOException;
import java.util.List;
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

        System.out.println("AUTH HEADER = " + authHeader);
        System.out.println("FILTER HIT: " + request.getRequestURI());

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

            String token = authHeader.substring(7).trim(); // Remove "Bearer " prefix
            System.out.println("TOKEN BEFORE PARSE = [" + token + "]");

            Claims claims = Jwts.parserBuilder()
                .setSigningKey(JwtUtil.getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

            Long userId = ((Number) claims.get("userId")).longValue();
            Boolean isOrganizer = claims.get("isOrganizer", Boolean.class);

            request.setAttribute("userId", userId);
            request.setAttribute("isOrganizer", isOrganizer);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of() // empty authorities for now
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("JWT FILTER PASSED — userId=" + userId + ", isOrganizer=" + isOrganizer);

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token expired");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
        }

    }
}

