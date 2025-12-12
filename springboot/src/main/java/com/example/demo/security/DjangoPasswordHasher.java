package com.example.demo.security;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class DjangoPasswordHasher {

    private static final String ALGORITHM = "pbkdf2_sha256";
    private static final int ITERATIONS = 260000; // Django default
    private static final int SALT_LENGTH = 16;    // 16 bytes
    private static final int KEY_LENGTH = 256;    // 256 bits

    // ✅ Generate Django-style password hash
    public static String encode(String password) {
        try {
            // Generate random salt
            byte[] saltBytes = new byte[SALT_LENGTH];
            SecureRandom.getInstanceStrong().nextBytes(saltBytes);
            String salt = Base64.getEncoder().encodeToString(saltBytes);

            // Hash password
            byte[] hash = pbkdf2(password.toCharArray(), saltBytes, ITERATIONS, KEY_LENGTH);

            // Django format: algorithm$iterations$salt$hash
            return String.format("%s$%d$%s$%s",
                    ALGORITHM,
                    ITERATIONS,
                    salt,
                    Base64.getEncoder().encodeToString(hash)
            );

        } catch (Exception e) {
            throw new RuntimeException("Error encoding password", e);
        }
    }

    // ✅ Validate password
    public static boolean checkPassword(String rawPassword, String djangoHash) {
        try {
            String[] parts = djangoHash.split("\\$");
            if (parts.length != 4) return false;

            String algorithm = parts[0];
            int iterations = Integer.parseInt(parts[1]);
            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] stored = Base64.getDecoder().decode(parts[3]);

            if (!algorithm.equals(ALGORITHM)) return false;

            byte[] testHash = pbkdf2(rawPassword.toCharArray(), salt, iterations, stored.length * 8);

            // Constant-time comparison
            if (testHash.length != stored.length) return false;
            for (int i = 0; i < stored.length; i++) {
                if (testHash[i] != stored[i]) return false;
            }

            return true;

        } catch (Exception e) {
            return false;
        }
    }

    // ✅ PBKDF2 helper
    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int keyLength)
            throws Exception {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        return skf.generateSecret(spec).getEncoded();
    }
}

