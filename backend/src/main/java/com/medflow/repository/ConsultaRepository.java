package com.medflow.repository;

import com.medflow.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByPacienteIdOrderByDataHoraDesc(Long pacienteId);
    List<Consulta> findByMedicoIdOrderByDataHoraDesc(Long medicoId);
    List<Consulta> findByDataHoraBetweenOrderByDataHoraAsc(LocalDateTime inicio, LocalDateTime fim);
    List<Consulta> findByStatusOrderByDataHoraAsc(Consulta.StatusConsulta status);
}
