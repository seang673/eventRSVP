package com.example.demo.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET = "your-secret-key";

    public static String generateToken(Long userId, boolean isOrganizer) {
        return Jwts.builder()
            .claim("userId", userId)
            .claim("isOrganizer", isOrganizer)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
            .signWith(SignatureAlgorithm.HS256, SECRET)
            .compact();
    }
}


