package com.medpharm.dto;

public class DetalleRecetaResponseDTO {
    private Long medicamentoId;
    private String medicamentoNombre;
    private Integer cantidad;
    private String dosisIndicada;

    public DetalleRecetaResponseDTO(Long medicamentoId, String medicamentoNombre, Integer cantidad, String dosisIndicada) {
        this.medicamentoId = medicamentoId;
        this.medicamentoNombre = medicamentoNombre;
        this.cantidad = cantidad;
        this.dosisIndicada = dosisIndicada;
    }
    
    public Long getMedicamentoId() {
        return medicamentoId;
    }
    public void setMedicamentoId(Long medicamentoId) {
        this.medicamentoId = medicamentoId;
    }
    public String getMedicamentoNombre() {
        return medicamentoNombre;
    }
    public void setMedicamentoNombre(String medicamentoNombre) {
        this.medicamentoNombre = medicamentoNombre;
    }
    public Integer getCantidad() {
        return cantidad;
    }
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public String getDosisIndicada() {
        return dosisIndicada;
    }
    public void setDosisIndicada(String dosisIndicada) {
        this.dosisIndicada = dosisIndicada;
    }

    
}