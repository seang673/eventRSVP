package com.example.demo.security;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.util.Base64;

public class DjangoPasswordHasher {

    public static boolean checkPassword(String rawPassword, String djangoHash) {
        try {
            String[] parts = djangoHash.split("\\$");
            String algorithm = parts[0]; // pbkdf2_sha256
            int iterations = Integer.parseInt(parts[1]);
            String salt = parts[2];
            String hash = parts[3];

            PBEKeySpec spec = new PBEKeySpec(
                rawPassword.toCharArray(),
                salt.getBytes(),
                iterations,
                256
            );

            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] testHash = skf.generateSecret(spec).getEncoded();

            String encoded = Base64.getEncoder().encodeToString(testHash);

            return encoded.equals(hash);

        } catch (Exception e) {
            return false;
        }
    }
}

