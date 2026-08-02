package com.medflow.repository;

import com.medflow.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByCpf(String cpf);
    List<Paciente> findByNomeContainingIgnoreCase(String nome);
    boolean existsByCpf(String cpf);
}
