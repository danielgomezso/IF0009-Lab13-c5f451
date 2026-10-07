package com.medpharm.dto;

public class DetalleRecetaRequestDTO {
    private Long medicamentoId;
    private Integer cantidad;
    private String dosisIndicada;
    
    public Long getMedicamentoId() {
        return medicamentoId;
    }
    public void setMedicamentoId(Long medicamentoId) {
        this.medicamentoId = medicamentoId;
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