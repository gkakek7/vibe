package com.vibe.main.service;

import com.vibe.main.domain.Department;
import com.vibe.main.dto.request.DepartmentRequest;
import com.vibe.main.dto.response.DepartmentResponse;
import com.vibe.main.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getTree() {
        return departmentRepository.findByParentIsNullOrderBySortOrder()
                .stream()
                .map(DepartmentResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        Department parent = request.getParentId() != null
                ? departmentRepository.findById(request.getParentId())
                        .orElseThrow(() -> new RuntimeException("상위 부서를 찾을 수 없습니다."))
                : null;
        Department dept = new Department(request.getName(), parent, request.getSortOrder());
        return new DepartmentResponse(departmentRepository.save(dept));
    }

    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("부서를 찾을 수 없습니다."));
        Department parent = request.getParentId() != null
                ? departmentRepository.findById(request.getParentId())
                        .orElseThrow(() -> new RuntimeException("상위 부서를 찾을 수 없습니다."))
                : null;
        dept.update(request.getName(), parent, request.getSortOrder());
        return new DepartmentResponse(dept);
    }

    @Transactional
    public void delete(Long id) {
        departmentRepository.deleteById(id);
    }
}
