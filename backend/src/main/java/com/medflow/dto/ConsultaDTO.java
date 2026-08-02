package com.medflow.dto;

import com.medflow.entity.Consulta;
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
public class ConsultaDTO {
    private Long id;

    @NotNull(message = "Paciente e obrigatorio")
    private Long pacienteId;
    private String pacienteNome;

    @NotNull(message = "Medico e obrigatorio")
    private Long medicoId;
    private String medicoNome;

    @NotNull(message = "Data e hora sao obrigatorias")
    private LocalDateTime dataHora;

    private LocalDateTime dataHoraFim;
    private Consulta.StatusConsulta status;
    private String tipoConsulta;
    private String observacoes;
    private java.math.BigDecimal valor;
    private String formaPagamento;
    private boolean pago;
}
