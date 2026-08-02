package com.medflow.controller;

import com.medflow.dto.ProntuarioDTO;
import com.medflow.service.ProntuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prontuarios")
@RequiredArgsConstructor
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    @GetMapping
    public ResponseEntity<List<ProntuarioDTO>> listarPorPaciente(@RequestParam Long pacienteId) {
        return ResponseEntity.ok(prontuarioService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(prontuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProntuarioDTO> criar(@Valid @RequestBody ProntuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prontuarioService.criar(dto));
    }
}
