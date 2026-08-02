package com.medflow.service;

import com.medflow.dto.ConsultaDTO;
import com.medflow.entity.Consulta;
import com.medflow.entity.Medico;
import com.medflow.entity.Paciente;
import com.medflow.exception.ResourceNotFoundException;
import com.medflow.repository.ConsultaRepository;
import com.medflow.repository.MedicoRepository;
import com.medflow.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;

    @Transactional(readOnly = true)
    public List<ConsultaDTO> listarTodas(Long pacienteId, Long medicoId) {
        List<Consulta> consultas;
        if (pacienteId != null) {
            consultas = consultaRepository.findByPacienteIdOrderByDataHoraDesc(pacienteId);
        } else if (medicoId != null) {
            consultas = consultaRepository.findByMedicoIdOrderByDataHoraDesc(medicoId);
        } else {
            consultas = consultaRepository.findAll();
        }
        return consultas.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConsultaDTO> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return consultaRepository.findByDataHoraBetweenOrderByDataHoraAsc(inicio, fim)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ConsultaDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional
    public ConsultaDTO criar(ConsultaDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado: " + dto.getPacienteId()));
        Medico medico = medicoRepository.findById(dto.getMedicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado: " + dto.getMedicoId()));

        Consulta consulta = Consulta.builder()
                .paciente(paciente)
                .medico(medico)
                .dataHora(dto.getDataHora())
                .dataHoraFim(dto.getDataHoraFim())
                .status(dto.getStatus() != null ? dto.getStatus() : Consulta.StatusConsulta.AGENDADA)
                .tipoConsulta(dto.getTipoConsulta())
                .observacoes(dto.getObservacoes())
                .valor(dto.getValor())
                .formaPagamento(dto.getFormaPagamento())
                .pago(dto.isPago())
                .build();

        return toDTO(consultaRepository.save(consulta));
    }

    @Transactional
    public ConsultaDTO atualizar(Long id, ConsultaDTO dto) {
        Consulta consulta = buscarEntidade(id);

        if (!consulta.getPaciente().getId().equals(dto.getPacienteId())) {
            Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado: " + dto.getPacienteId()));
            consulta.setPaciente(paciente);
        }

        if (!consulta.getMedico().getId().equals(dto.getMedicoId())) {
            Medico medico = medicoRepository.findById(dto.getMedicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado: " + dto.getMedicoId()));
            consulta.setMedico(medico);
        }

        consulta.setDataHora(dto.getDataHora());
        consulta.setDataHoraFim(dto.getDataHoraFim());
        if (dto.getStatus() != null) {
            consulta.setStatus(dto.getStatus());
        }
        consulta.setTipoConsulta(dto.getTipoConsulta());
        consulta.setObservacoes(dto.getObservacoes());
        consulta.setValor(dto.getValor());
        consulta.setFormaPagamento(dto.getFormaPagamento());
        consulta.setPago(dto.isPago());

        return toDTO(consultaRepository.save(consulta));
    }

    @Transactional
    public void cancelar(Long id) {
        Consulta consulta = buscarEntidade(id);
        consulta.setStatus(Consulta.StatusConsulta.CANCELADA);
        consultaRepository.save(consulta);
    }

    private Consulta buscarEntidade(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta nao encontrada: " + id));
    }

    ConsultaDTO toDTO(Consulta c) {
        return ConsultaDTO.builder()
                .id(c.getId())
                .pacienteId(c.getPaciente().getId())
                .pacienteNome(c.getPaciente().getNome())
                .medicoId(c.getMedico().getId())
                .medicoNome(c.getMedico().getNome())
                .dataHora(c.getDataHora())
                .dataHoraFim(c.getDataHoraFim())
                .status(c.getStatus())
                .tipoConsulta(c.getTipoConsulta())
                .observacoes(c.getObservacoes())
                .valor(c.getValor())
                .formaPagamento(c.getFormaPagamento())
                .pago(c.isPago())
                .build();
    }
}
