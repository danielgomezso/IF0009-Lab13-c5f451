package com.medpharm.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RecetaResponseDTO {
    private Long id;
    private String codigoReceta;
    private String pacienteNombre;
    private String medicoNombre;
    private String estado;
    private LocalDateTime fechaEmision;
    private List<DetalleRecetaResponseDTO> detalles;

    public RecetaResponseDTO(Long id, String codigoReceta, String pacienteNombre, String medicoNombre,
            String estado, LocalDateTime fechaEmision, List<DetalleRecetaResponseDTO> detalles) {
        this.id = id;
        this.codigoReceta = codigoReceta;
        this.pacienteNombre = pacienteNombre;
        this.medicoNombre = medicoNombre;
        this.estado = estado;
        this.fechaEmision = fechaEmision;
        this.detalles = detalles;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getCodigoReceta() {
        return codigoReceta;
    }
    public void setCodigoReceta(String codigoReceta) {
        this.codigoReceta = codigoReceta;
    }
    public String getPacienteNombre() {
        return pacienteNombre;
    }
    public void setPacienteNombre(String pacienteNombre) {
        this.pacienteNombre = pacienteNombre;
    }
    public String getMedicoNombre() {
        return medicoNombre;
    }
    public void setMedicoNombre(String medicoNombre) {
        this.medicoNombre = medicoNombre;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }
    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    public List<DetalleRecetaResponseDTO> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<DetalleRecetaResponseDTO> detalles) {
        this.detalles = detalles;
    }

    
}