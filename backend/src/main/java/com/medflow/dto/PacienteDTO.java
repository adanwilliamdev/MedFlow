package com.medflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "CPF e obrigatorio")
    private String cpf;

    @NotNull(message = "Data de nascimento e obrigatoria")
    private LocalDate dataNascimento;

    private String sexo;
    private String convenio;
    private String numeroConvenio;
    private String planoConvenio;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    private String telefone;
    private String celular;
    private String email;
    private String contatoEmergencia;
    private String telefoneEmergencia;
    private String observacoes;
    private boolean ativo;
}
