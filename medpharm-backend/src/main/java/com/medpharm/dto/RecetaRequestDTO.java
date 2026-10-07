package com.medpharm.dto;

import java.util.List;

public class RecetaRequestDTO {
    private String pacienteNombre;
    private List<DetalleRecetaRequestDTO> detalles;
    
    public String getPacienteNombre() {
        return pacienteNombre;
    }
    public void setPacienteNombre(String pacienteNombre) {
        this.pacienteNombre = pacienteNombre;
    }
    public List<DetalleRecetaRequestDTO> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<DetalleRecetaRequestDTO> detalles) {
        this.detalles = detalles;
    }


}