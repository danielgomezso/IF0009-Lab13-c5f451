package com.medpharm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_receta")
public class DetalleReceta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receta_id")
    private RecetaMedica receta;

    @ManyToOne
    @JoinColumn(name = "medicamento_id")
    private Medicamento medicamento;

    private Integer cantidad;
    private String dosisIndicada;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public RecetaMedica getReceta() {
        return receta;
    }
    public void setReceta(RecetaMedica receta) {
        this.receta = receta;
    }
    public Medicamento getMedicamento() {
        return medicamento;
    }
    public void setMedicamento(Medicamento medicamento) {
        this.medicamento = medicamento;
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