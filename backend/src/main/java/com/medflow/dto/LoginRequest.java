package com.medflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Usuario e obrigatorio")
    private String username;

    @NotBlank(message = "Senha e obrigatoria")
    private String password;
}
