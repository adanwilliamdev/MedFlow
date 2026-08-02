package com.medflow.repository;

import com.medflow.entity.Medico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Optional<Medico> findByCrm(String crm);
    List<Medico> findByNomeContainingIgnoreCase(String nome);
    List<Medico> findByEspecialidadeContainingIgnoreCase(String especialidade);
    boolean existsByCrm(String crm);
}
