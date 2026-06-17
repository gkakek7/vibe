package com.vibe.main.service;

import com.vibe.main.domain.Department;
import com.vibe.main.domain.Employee;
import com.vibe.main.domain.Role;
import com.vibe.main.dto.request.EmployeeRequest;
import com.vibe.main.dto.response.EmployeeResponse;
import com.vibe.main.repository.DepartmentRepository;
import com.vibe.main.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll().stream()
                .map(EmployeeResponse::new)
                .collect(Collectors.toList());
    }

    public List<EmployeeResponse> getByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .map(EmployeeResponse::new)
                .collect(Collectors.toList());
    }

    public EmployeeResponse getById(Long id) {
        return new EmployeeResponse(findEmployee(id));
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }
        Department dept = findDepartment(request.getDepartmentId());
        Employee employee = new Employee(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getPosition(),
                dept,
                Role.valueOf(request.getRole())
        );
        return new EmployeeResponse(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = findEmployee(id);
        Department dept = findDepartment(request.getDepartmentId());
        employee.update(request.getName(), request.getEmail(), request.getPhone(), request.getPosition(), dept);
        return new EmployeeResponse(employee);
    }

    @Transactional
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    private Employee findEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사원을 찾을 수 없습니다."));
    }

    private Department findDepartment(Long departmentId) {
        if (departmentId == null) return null;
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("부서를 찾을 수 없습니다."));
    }
}
