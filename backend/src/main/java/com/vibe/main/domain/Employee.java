package com.vibe.main.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "employee")
@Getter
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private String email;

    private String phone;

    private String position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public Employee(String username, String password, String name, String email,
                    String phone, String position, Department department, Role role) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.position = position;
        this.department = department;
        this.role = role;
    }

    public void update(String name, String email, String phone, String position, Department department) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.position = position;
        this.department = department;
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}
