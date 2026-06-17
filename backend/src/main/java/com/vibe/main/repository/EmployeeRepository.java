package com.vibe.main.repository;

import com.vibe.main.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUsername(String username);
    boolean existsByUsername(String username);

    @Query(value = "SELECT e.* FROM employee e " +
            "LEFT JOIN position_grade p ON e.position = p.name " +
            "WHERE e.department_id = :deptId " +
            "ORDER BY COALESCE(p.priority, 2147483647) ASC, e.id ASC",
            nativeQuery = true)
    List<Employee> findByDepartmentIdOrderByPositionPriorityAndId(@Param("deptId") Long deptId);
}
