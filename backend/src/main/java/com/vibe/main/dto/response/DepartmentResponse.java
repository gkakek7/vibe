package com.vibe.main.dto.response;

import com.vibe.main.domain.Department;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class DepartmentResponse {
    private Long id;
    private String name;
    private Long parentId;
    private Integer sortOrder;
    private List<DepartmentResponse> children;

    public DepartmentResponse(Department dept) {
        this.id = dept.getId();
        this.name = dept.getName();
        this.parentId = dept.getParent() != null ? dept.getParent().getId() : null;
        this.sortOrder = dept.getSortOrder();
        this.children = dept.getChildren().stream()
                .map(DepartmentResponse::new)
                .collect(Collectors.toList());
    }
}
