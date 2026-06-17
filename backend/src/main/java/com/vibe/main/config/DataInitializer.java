package com.vibe.main.config;

import com.vibe.main.domain.Employee;
import com.vibe.main.domain.Role;
import com.vibe.main.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!employeeRepository.existsByUsername("admin")) {
            Employee admin = new Employee(
                    "admin",
                    passwordEncoder.encode("admin1234"),
                    "관리자",
                    "admin@vibe.com",
                    "010-0000-0000",
                    "관리자",
                    null,
                    Role.ROLE_ADMIN
            );
            employeeRepository.save(admin);
        }
    }
}
