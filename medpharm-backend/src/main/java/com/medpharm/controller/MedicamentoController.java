package com.medpharm.controller;

import com.medpharm.model.Medicamento;
import com.medpharm.repository.MedicamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medicamentos")
@RequiredArgsConstructor
public class MedicamentoController {

    private final MedicamentoRepository medicamentoRepository;

    @GetMapping
    public List<Medicamento> listar() {
        return medicamentoRepository.findAll();
    }
}