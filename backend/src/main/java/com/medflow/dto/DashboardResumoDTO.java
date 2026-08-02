package com.medflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResumoDTO {
    private long totalPacientes;
    private long totalMedicos;
    private long consultasHoje;
    private long consultasSemana;
    private double faturamentoMes;
    private double faturamentoPendente;
    private List<ConsultaDTO> proximasConsultas;
}
