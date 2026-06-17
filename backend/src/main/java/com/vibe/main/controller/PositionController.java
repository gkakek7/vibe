package com.vibe.main.controller;

import com.vibe.main.dto.request.PositionRequest;
import com.vibe.main.dto.response.PositionResponse;
import com.vibe.main.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public ResponseEntity<List<PositionResponse>> getAll() {
        return ResponseEntity.ok(positionService.getAll());
    }

    @PostMapping
    public ResponseEntity<PositionResponse> create(@RequestBody PositionRequest request) {
        return ResponseEntity.ok(positionService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PositionResponse> update(@PathVariable Long id, @RequestBody PositionRequest request) {
        return ResponseEntity.ok(positionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        positionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/up")
    public ResponseEntity<List<PositionResponse>> moveUp(@PathVariable Long id) {
        return ResponseEntity.ok(positionService.moveUp(id));
    }

    @PatchMapping("/{id}/down")
    public ResponseEntity<List<PositionResponse>> moveDown(@PathVariable Long id) {
        return ResponseEntity.ok(positionService.moveDown(id));
    }
}
