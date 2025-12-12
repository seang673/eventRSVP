package com.example.demo.controller;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req) {
        CustomUser user = authService.authenticate(req.getUsername(), req.getPassword());

        String token = JwtUtil.generateToken(user.getId(), user.isOrganizer());

        return Map.of("token", token);
    }
}

