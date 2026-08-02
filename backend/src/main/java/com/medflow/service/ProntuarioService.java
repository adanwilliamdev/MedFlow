package com.medflow.service;

import com.medflow.dto.ProntuarioDTO;
import com.medflow.entity.Consulta;
import com.medflow.entity.Medico;
import com.medflow.entity.Paciente;
import com.medflow.entity.Prontuario;
import com.medflow.exception.ResourceNotFoundException;
import com.medflow.repository.ConsultaRepository;
import com.medflow.repository.MedicoRepository;
import com.medflow.repository.PacienteRepository;
import com.medflow.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final ConsultaRepository consultaRepository;

    @Transactional(readOnly = true)
    public List<ProntuarioDTO> listarPorPaciente(Long pacienteId) {
        return prontuarioRepository.findByPacienteIdOrderByDataRegistroDesc(pacienteId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProntuarioDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional
    public ProntuarioDTO criar(ProntuarioDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado: " + dto.getPacienteId()));

        Medico medico = null;
        if (dto.getMedicoId() != null) {
            medico = medicoRepository.findById(dto.getMedicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado: " + dto.getMedicoId()));
        }

        Consulta consulta = null;
        if (dto.getConsultaId() != null) {
            consulta = consultaRepository.findById(dto.getConsultaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consulta nao encontrada: " + dto.getConsultaId()));
        }

        Prontuario prontuario = Prontuario.builder()
                .paciente(paciente)
                .medico(medico)
                .consulta(consulta)
                .queixaPrincipal(dto.getQueixaPrincipal())
                .historico(dto.getHistorico())
                .exameFisico(dto.getExameFisico())
                .diagnostico(dto.getDiagnostico())
                .prescricao(dto.getPrescricao())
                .examesSolicitados(dto.getExamesSolicitados())
                .observacoes(dto.getObservacoes())
                .dataRegistro(dto.getDataRegistro() != null ? dto.getDataRegistro() : LocalDateTime.now())
                .build();

        return toDTO(prontuarioRepository.save(prontuario));
    }

    private Prontuario buscarEntidade(Long id) {
        return prontuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prontuario nao encontrado: " + id));
    }

    private ProntuarioDTO toDTO(Prontuario p) {
        return ProntuarioDTO.builder()
                .id(p.getId())
                .pacienteId(p.getPaciente().getId())
                .pacienteNome(p.getPaciente().getNome())
                .medicoId(p.getMedico() != null ? p.getMedico().getId() : null)
                .medicoNome(p.getMedico() != null ? p.getMedico().getNome() : null)
                .consultaId(p.getConsulta() != null ? p.getConsulta().getId() : null)
                .queixaPrincipal(p.getQueixaPrincipal())
                .historico(p.getHistorico())
                .exameFisico(p.getExameFisico())
                .diagnostico(p.getDiagnostico())
                .prescricao(p.getPrescricao())
                .examesSolicitados(p.getExamesSolicitados())
                .observacoes(p.getObservacoes())
                .dataRegistro(p.getDataRegistro())
                .build();
    }
}
