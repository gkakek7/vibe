package com.vibe.main.dto.response;

import com.vibe.main.domain.Position;
import lombok.Getter;

@Getter
public class PositionResponse {
    private Long id;
    private String name;
    private Integer priority;

    public PositionResponse(Position position) {
        this.id = position.getId();
        this.name = position.getName();
        this.priority = position.getPriority();
    }
}
