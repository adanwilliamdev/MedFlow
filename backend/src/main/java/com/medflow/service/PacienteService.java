package com.medflow.service;

import com.medflow.dto.PacienteDTO;
import com.medflow.entity.Paciente;
import com.medflow.exception.BusinessException;
import com.medflow.exception.ResourceNotFoundException;
import com.medflow.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<PacienteDTO> listarTodos(String nome) {
        List<Paciente> pacientes = (nome == null || nome.isBlank())
                ? pacienteRepository.findAll()
                : pacienteRepository.findByNomeContainingIgnoreCase(nome);
        return pacientes.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PacienteDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional
    public PacienteDTO criar(PacienteDTO dto) {
        if (pacienteRepository.existsByCpf(dto.getCpf())) {
            throw new BusinessException("Ja existe um paciente cadastrado com este CPF");
        }
        Paciente paciente = toEntity(dto);
        paciente.setId(null);
        paciente.setAtivo(true);
        return toDTO(pacienteRepository.save(paciente));
    }

    @Transactional
    public PacienteDTO atualizar(Long id, PacienteDTO dto) {
        Paciente paciente = buscarEntidade(id);

        pacienteRepository.findByCpf(dto.getCpf()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new BusinessException("Ja existe outro paciente cadastrado com este CPF");
            }
        });

        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setDataNascimento(dto.getDataNascimento());
        paciente.setSexo(dto.getSexo());
        paciente.setConvenio(dto.getConvenio());
        paciente.setNumeroConvenio(dto.getNumeroConvenio());
        paciente.setPlanoConvenio(dto.getPlanoConvenio());
        paciente.setLogradouro(dto.getLogradouro());
        paciente.setNumero(dto.getNumero());
        paciente.setComplemento(dto.getComplemento());
        paciente.setBairro(dto.getBairro());
        paciente.setCidade(dto.getCidade());
        paciente.setEstado(dto.getEstado());
        paciente.setCep(dto.getCep());
        paciente.setTelefone(dto.getTelefone());
        paciente.setCelular(dto.getCelular());
        paciente.setEmail(dto.getEmail());
        paciente.setContatoEmergencia(dto.getContatoEmergencia());
        paciente.setTelefoneEmergencia(dto.getTelefoneEmergencia());
        paciente.setObservacoes(dto.getObservacoes());

        return toDTO(pacienteRepository.save(paciente));
    }

    @Transactional
    public void inativar(Long id) {
        Paciente paciente = buscarEntidade(id);
        paciente.setAtivo(false);
        pacienteRepository.save(paciente);
    }

    private Paciente buscarEntidade(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado: " + id));
    }

    private PacienteDTO toDTO(Paciente p) {
        return PacienteDTO.builder()
                .id(p.getId())
                .nome(p.getNome())
                .cpf(p.getCpf())
                .dataNascimento(p.getDataNascimento())
                .sexo(p.getSexo())
                .convenio(p.getConvenio())
                .numeroConvenio(p.getNumeroConvenio())
                .planoConvenio(p.getPlanoConvenio())
                .logradouro(p.getLogradouro())
                .numero(p.getNumero())
                .complemento(p.getComplemento())
                .bairro(p.getBairro())
                .cidade(p.getCidade())
                .estado(p.getEstado())
                .cep(p.getCep())
                .telefone(p.getTelefone())
                .celular(p.getCelular())
                .email(p.getEmail())
                .contatoEmergencia(p.getContatoEmergencia())
                .telefoneEmergencia(p.getTelefoneEmergencia())
                .observacoes(p.getObservacoes())
                .ativo(p.isAtivo())
                .build();
    }

    private Paciente toEntity(PacienteDTO dto) {
        return Paciente.builder()
                .id(dto.getId())
                .nome(dto.getNome())
                .cpf(dto.getCpf())
                .dataNascimento(dto.getDataNascimento())
                .sexo(dto.getSexo())
                .convenio(dto.getConvenio())
                .numeroConvenio(dto.getNumeroConvenio())
                .planoConvenio(dto.getPlanoConvenio())
                .logradouro(dto.getLogradouro())
                .numero(dto.getNumero())
                .complemento(dto.getComplemento())
                .bairro(dto.getBairro())
                .cidade(dto.getCidade())
                .estado(dto.getEstado())
                .cep(dto.getCep())
                .telefone(dto.getTelefone())
                .celular(dto.getCelular())
                .email(dto.getEmail())
                .contatoEmergencia(dto.getContatoEmergencia())
                .telefoneEmergencia(dto.getTelefoneEmergencia())
                .observacoes(dto.getObservacoes())
                .ativo(dto.isAtivo())
                .build();
    }
}
