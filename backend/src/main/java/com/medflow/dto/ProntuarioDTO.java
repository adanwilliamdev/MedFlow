package com.medflow.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProntuarioDTO {
    private Long id;

    @NotNull(message = "Paciente e obrigatorio")
    private Long pacienteId;
    private String pacienteNome;

    private Long medicoId;
    private String medicoNome;

    private Long consultaId;

    private String queixaPrincipal;
    private String historico;
    private String exameFisico;
    private String diagnostico;
    private String prescricao;
    private String examesSolicitados;
    private String observacoes;
    private LocalDateTime dataRegistro;
}
