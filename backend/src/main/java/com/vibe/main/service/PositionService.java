package com.vibe.main.service;

import com.vibe.main.domain.Position;
import com.vibe.main.dto.request.PositionRequest;
import com.vibe.main.dto.response.PositionResponse;
import com.vibe.main.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PositionService {

    private final PositionRepository positionRepository;

    public List<PositionResponse> getAll() {
        return positionRepository.findAllByOrderByPriorityAsc()
                .stream().map(PositionResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public PositionResponse create(PositionRequest request) {
        int priority = request.getPriority() != null ? request.getPriority()
                : positionRepository.findAllByOrderByPriorityAsc().size() + 1;
        return new PositionResponse(positionRepository.save(new Position(request.getName(), priority)));
    }

    @Transactional
    public PositionResponse update(Long id, PositionRequest request) {
        Position position = findById(id);
        position.update(request.getName(), request.getPriority() != null ? request.getPriority() : position.getPriority());
        return new PositionResponse(position);
    }

    @Transactional
    public void delete(Long id) {
        positionRepository.deleteById(id);
    }

    @Transactional
    public List<PositionResponse> moveUp(Long id) {
        List<Position> all = positionRepository.findAllByOrderByPriorityAsc();
        int idx = indexById(all, id);
        if (idx > 0) {
            all.get(idx).swapPriority(all.get(idx - 1));
        }
        return all.stream().map(PositionResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public List<PositionResponse> moveDown(Long id) {
        List<Position> all = positionRepository.findAllByOrderByPriorityAsc();
        int idx = indexById(all, id);
        if (idx >= 0 && idx < all.size() - 1) {
            all.get(idx).swapPriority(all.get(idx + 1));
        }
        return all.stream().map(PositionResponse::new).collect(Collectors.toList());
    }

    private Position findById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("직급을 찾을 수 없습니다."));
    }

    private int indexById(List<Position> list, Long id) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId().equals(id)) return i;
        }
        return -1;
    }
}
