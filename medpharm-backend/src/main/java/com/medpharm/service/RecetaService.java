package com.medpharm.service;

import com.medpharm.dto.DetalleRecetaResponseDTO;
import com.medpharm.dto.RecetaRequestDTO;
import com.medpharm.dto.RecetaResponseDTO;
import com.medpharm.model.DetalleReceta;
import com.medpharm.model.Medicamento;
import com.medpharm.model.RecetaMedica;
import com.medpharm.model.Usuario;
import com.medpharm.repository.MedicamentoRepository;
import com.medpharm.repository.RecetaMedicaRepository;
import com.medpharm.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecetaService {

    private final RecetaMedicaRepository recetaRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<RecetaResponseDTO> listar() {
        return recetaRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<RecetaResponseDTO> listarPorEstado(String estado) {
        return recetaRepository.findByEstado(estado.toUpperCase()).stream().map(this::toDTO).toList();
    }

    @Transactional
    public RecetaResponseDTO crear(RecetaRequestDTO request, String username) {
        if (request.getPacienteNombre() == null || request.getPacienteNombre().trim().length() < 5) {
            throw new IllegalArgumentException("El nombre del paciente debe tener al menos 5 caracteres");
        }
        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("La receta debe incluir al menos un medicamento");
        }
        Usuario medico = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        RecetaMedica receta = new RecetaMedica();
        receta.setCodigoReceta("REC-" + LocalDateTime.now().getYear() + "-"
                + String.format("%03d", recetaRepository.count() + 1));
        receta.setPacienteNombre(request.getPacienteNombre().trim());
        receta.setMedico(medico);
        receta.setEstado("PENDIENTE");
        receta.setFechaEmision(LocalDateTime.now());

        List<DetalleReceta> detalles = request.getDetalles().stream().map(d -> {
            if (d.getCantidad() == null || d.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser un entero mayor a 0");
            }
            Medicamento medicamento = medicamentoRepository.findById(d.getMedicamentoId())
                    .orElseThrow(() -> new NoSuchElementException("Medicamento no encontrado: " + d.getMedicamentoId()));
            if (medicamento.getStock() < d.getCantidad()) {
                throw new IllegalStateException("Stock insuficiente para " + medicamento.getNombre());
            }
            DetalleReceta detalle = new DetalleReceta();
            detalle.setReceta(receta);
            detalle.setMedicamento(medicamento);
            detalle.setCantidad(d.getCantidad());
            detalle.setDosisIndicada(d.getDosisIndicada());
            return detalle;
        }).collect(Collectors.toCollection(ArrayList::new));

        receta.setDetalles(detalles);
        return toDTO(recetaRepository.save(receta));
    }

    @Transactional
    public RecetaResponseDTO cambiarEstado(Long id, String estado) {
        String nuevo = estado == null ? "" : estado.toUpperCase();
        if (!nuevo.equals("DESPACHADA") && !nuevo.equals("CANCELADA")) {
            throw new IllegalArgumentException("Estado inválido: solo DESPACHADA o CANCELADA");
        }
        RecetaMedica receta = recetaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Receta no encontrada: " + id));
        if (!"PENDIENTE".equals(receta.getEstado())) {
            throw new IllegalStateException("Solo se puede modificar una receta pendiente");
        }
        if (nuevo.equals("DESPACHADA")) {
            receta.getDetalles().forEach(d -> {
                Medicamento medicamento = d.getMedicamento();
                if (medicamento.getStock() < d.getCantidad()) {
                    throw new IllegalStateException("Stock insuficiente para " + medicamento.getNombre());
                }
                medicamento.setStock(medicamento.getStock() - d.getCantidad());
            });
        }
        receta.setEstado(nuevo);
        return toDTO(receta);
    }

    private RecetaResponseDTO toDTO(RecetaMedica receta) {
        List<DetalleRecetaResponseDTO> detalles = receta.getDetalles().stream()
                .map(d -> new DetalleRecetaResponseDTO(
                        d.getMedicamento().getId(),
                        d.getMedicamento().getNombre(),
                        d.getCantidad(),
                        d.getDosisIndicada()))
                .toList();
        return new RecetaResponseDTO(
                receta.getId(),
                receta.getCodigoReceta(),
                receta.getPacienteNombre(),
                receta.getMedico().getNombreCompleto(),
                receta.getEstado(),
                receta.getFechaEmision(),
                detalles);
    }
}