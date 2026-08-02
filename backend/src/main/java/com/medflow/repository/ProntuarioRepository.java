package com.medflow.repository;

import com.medflow.entity.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
    List<Prontuario> findByPacienteIdOrderByDataRegistroDesc(Long pacienteId);
}
