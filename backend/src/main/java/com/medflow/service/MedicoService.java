package com.medflow.service;

import com.medflow.dto.MedicoDTO;
import com.medflow.entity.Medico;
import com.medflow.exception.BusinessException;
import com.medflow.exception.ResourceNotFoundException;
import com.medflow.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;

    @Transactional(readOnly = true)
    public List<MedicoDTO> listarTodos(String nome) {
        List<Medico> medicos = (nome == null || nome.isBlank())
                ? medicoRepository.findAll()
                : medicoRepository.findByNomeContainingIgnoreCase(nome);
        return medicos.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicoDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    @Transactional
    public MedicoDTO criar(MedicoDTO dto) {
        if (medicoRepository.existsByCrm(dto.getCrm())) {
            throw new BusinessException("Ja existe um medico cadastrado com este CRM");
        }
        Medico medico = toEntity(dto);
        medico.setId(null);
        medico.setAtivo(true);
        if (medico.getPercentualComissao() == null) {
            medico.setPercentualComissao(java.math.BigDecimal.ZERO);
        }
        return toDTO(medicoRepository.save(medico));
    }

    @Transactional
    public MedicoDTO atualizar(Long id, MedicoDTO dto) {
        Medico medico = buscarEntidade(id);

        medicoRepository.findByCrm(dto.getCrm()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new BusinessException("Ja existe outro medico cadastrado com este CRM");
            }
        });

        medico.setNome(dto.getNome());
        medico.setCrm(dto.getCrm());
        medico.setUfCrm(dto.getUfCrm());
        medico.setEspecialidade(dto.getEspecialidade());
        medico.setSubEspecialidade(dto.getSubEspecialidade());
        medico.setTelefone(dto.getTelefone());
        medico.setCelular(dto.getCelular());
        medico.setEmail(dto.getEmail());
        medico.setPercentualComissao(dto.getPercentualComissao());

        return toDTO(medicoRepository.save(medico));
    }

    @Transactional
    public void inativar(Long id) {
        Medico medico = buscarEntidade(id);
        medico.setAtivo(false);
        medicoRepository.save(medico);
    }

    private Medico buscarEntidade(Long id) {
        return medicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado: " + id));
    }

    private MedicoDTO toDTO(Medico m) {
        return MedicoDTO.builder()
                .id(m.getId())
                .nome(m.getNome())
                .crm(m.getCrm())
                .ufCrm(m.getUfCrm())
                .especialidade(m.getEspecialidade())
                .subEspecialidade(m.getSubEspecialidade())
                .telefone(m.getTelefone())
                .celular(m.getCelular())
                .email(m.getEmail())
                .percentualComissao(m.getPercentualComissao())
                .ativo(m.isAtivo())
                .build();
    }

    private Medico toEntity(MedicoDTO dto) {
        return Medico.builder()
                .id(dto.getId())
                .nome(dto.getNome())
                .crm(dto.getCrm())
                .ufCrm(dto.getUfCrm())
                .especialidade(dto.getEspecialidade())
                .subEspecialidade(dto.getSubEspecialidade())
                .telefone(dto.getTelefone())
                .celular(dto.getCelular())
                .email(dto.getEmail())
                .percentualComissao(dto.getPercentualComissao())
                .ativo(dto.isAtivo())
                .build();
    }
}
