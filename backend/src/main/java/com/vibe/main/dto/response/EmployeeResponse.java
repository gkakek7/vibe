package com.vibe.main.dto.response;

import com.vibe.main.domain.Employee;
import lombok.Getter;

@Getter
public class EmployeeResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String phone;
    private String position;
    private Long departmentId;
    private String departmentName;
    private String role;

    public EmployeeResponse(Employee emp) {
        this.id = emp.getId();
        this.username = emp.getUsername();
        this.name = emp.getName();
        this.email = emp.getEmail();
        this.phone = emp.getPhone();
        this.position = emp.getPosition();
        this.departmentId = emp.getDepartment() != null ? emp.getDepartment().getId() : null;
        this.departmentName = emp.getDepartment() != null ? emp.getDepartment().getName() : null;
        this.role = emp.getRole().name();
    }
}
