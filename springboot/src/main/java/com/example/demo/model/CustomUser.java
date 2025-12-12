package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customuser")
public class CustomUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String password;
    private String lastLogin;
    private boolean isSuperuser;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private boolean isStaff;
    private boolean isActive;
    private String dateJoined;
    private boolean isOrganizer;

    // getters and setters...
    public String getPassword(){
        return password;
    }
}

