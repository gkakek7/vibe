package com.vibe.main.repository;

import com.vibe.main.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUsername(String username);
    List<Employee> findByDepartmentId(Long departmentId);
    boolean existsByUsername(String username);
}
