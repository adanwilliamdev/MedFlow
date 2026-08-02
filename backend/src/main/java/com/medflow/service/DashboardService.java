package com.medflow.service;

import com.medflow.dto.ConsultaDTO;
import com.medflow.dto.DashboardResumoDTO;
import com.medflow.entity.Consulta;
import com.medflow.repository.ConsultaRepository;
import com.medflow.repository.MedicoRepository;
import com.medflow.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final ConsultaRepository consultaRepository;
    private final ConsultaService consultaService;

    @Transactional(readOnly = true)
    public DashboardResumoDTO resumo() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioHoje = hoje.atStartOfDay();
        LocalDateTime fimHoje = hoje.atTime(LocalTime.MAX);
        LocalDateTime inicioSemana = hoje.minusDays(7).atStartOfDay();
        LocalDateTime inicioMes = hoje.withDayOfMonth(1).atStartOfDay();

        List<Consulta> consultasHoje = consultaRepository.findByDataHoraBetweenOrderByDataHoraAsc(inicioHoje, fimHoje);
        List<Consulta> consultasSemana = consultaRepository.findByDataHoraBetweenOrderByDataHoraAsc(inicioSemana, fimHoje);
        List<Consulta> consultasMes = consultaRepository.findByDataHoraBetweenOrderByDataHoraAsc(inicioMes, fimHoje);

        double faturamentoMes = consultasMes.stream()
                .filter(Consulta::isPago)
                .mapToDouble(c -> c.getValor() != null ? c.getValor().doubleValue() : 0.0)
                .sum();

        double faturamentoPendente = consultasMes.stream()
                .filter(c -> !c.isPago())
                .mapToDouble(c -> c.getValor() != null ? c.getValor().doubleValue() : 0.0)
                .sum();

        List<ConsultaDTO> proximasConsultas = consultaRepository
                .findByDataHoraBetweenOrderByDataHoraAsc(LocalDateTime.now(), hoje.plusDays(7).atTime(LocalTime.MAX))
                .stream()
                .sorted(Comparator.comparing(Consulta::getDataHora))
                .limit(10)
                .map(consultaService::toDTO)
                .collect(Collectors.toList());

        return DashboardResumoDTO.builder()
                .totalPacientes(pacienteRepository.count())
                .totalMedicos(medicoRepository.count())
                .consultasHoje(consultasHoje.size())
                .consultasSemana(consultasSemana.size())
                .faturamentoMes(faturamentoMes)
                .faturamentoPendente(faturamentoPendente)
                .proximasConsultas(proximasConsultas)
                .build();
    }
}
