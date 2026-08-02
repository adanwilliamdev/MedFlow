package com.medflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicoDTO {
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "CRM e obrigatorio")
    private String crm;

    @NotBlank(message = "UF do CRM e obrigatoria")
    private String ufCrm;

    @NotBlank(message = "Especialidade e obrigatoria")
    private String especialidade;

    private String subEspecialidade;
    private String telefone;
    private String celular;
    private String email;
    private java.math.BigDecimal percentualComissao;
    private boolean ativo;
}
