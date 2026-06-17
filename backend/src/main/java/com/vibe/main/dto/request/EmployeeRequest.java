package com.vibe.main.dto.request;

import lombok.Getter;

@Getter
public class EmployeeRequest {
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private String position;
    private Long departmentId;
    private String role;
}
