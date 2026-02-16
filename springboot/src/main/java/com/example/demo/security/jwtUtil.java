package com.example.demo.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

import javax.crypto.SecretKey;

public class JwtUtil {

    /*Move to application.properties later */
    private static final String SECRET = "KJH87sd98sdf7sdf8sdf7sdf8sdf7sdf8";

    public static SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }


    public static String generateToken(Long userId, boolean isOrganizer) {
    return Jwts.builder()
            .claim("userId", userId)
            .claim("isOrganizer", isOrganizer)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public static Long extractUserId(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("userId", Long.class);
    }

    public static boolean extractIsOrganizer(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("isOrganizer", Boolean.class);
    }
}


