package com.vibe.main.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "position_grade")
@Getter
@NoArgsConstructor
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer priority;

    public Position(String name, Integer priority) {
        this.name = name;
        this.priority = priority;
    }

    public void update(String name, Integer priority) {
        this.name = name;
        this.priority = priority;
    }

    public void swapPriority(Position other) {
        int tmp = this.priority;
        this.priority = other.priority;
        other.priority = tmp;
    }
}
