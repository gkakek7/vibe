package com.vibe.main.dto.request;

import lombok.Getter;

@Getter
public class DepartmentRequest {
    private String name;
    private Long parentId;
    private Integer sortOrder;
}
