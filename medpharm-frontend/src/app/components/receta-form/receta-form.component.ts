import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Medicamento, RecetaRequest } from '../../models/models';
import { MedicamentoService } from '../../services/medicamento.service';
import { RecetaService } from '../../services/receta.service';
import { positivoValidator } from '../../validators/positivo.validator';

@Component({
    selector: 'app-receta-form',
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <div class="container">
      <h2>Nueva receta</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Paciente</label>
        <input formControlName="pacienteNombre" />
        @if (form.controls.pacienteNombre.touched && form.controls.pacienteNombre.errors) {
          <small>El nombre es requerido (mínimo 5 caracteres)</small>
        }

        <h3>Medicamentos</h3>
        <div formArrayName="detalles">
          @for (d of detalles.controls; track $index) {
            <div class="fila" [formGroupName]="$index">
              <div>
                <select formControlName="medicamentoId">
                  <option [ngValue]="null">Seleccione</option>
                  @for (m of medicamentos(); track m.id) {
                    <option [ngValue]="m.id">{{ m.nombre }} (stock {{ m.stock }})</option>
                  }
                </select>
                @if (d.controls.medicamentoId.touched && d.controls.medicamentoId.errors) {
                  <small>Seleccione un medicamento</small>
                }
              </div>
              <div>
                <input type="number" formControlName="cantidad" placeholder="Cantidad" />
                @if (d.controls.cantidad.touched && d.controls.cantidad.errors) {
                  <small>Ingrese un entero mayor a 0</small>
                }
              </div>
              <div>
                <input formControlName="dosisIndicada" placeholder="Dosis indicada" />
                @if (d.controls.dosisIndicada.touched && d.controls.dosisIndicada.errors) {
                  <small>La dosis es requerida</small>
                }
              </div>
              <button type="button" (click)="quitar($index)" [disabled]="detalles.length === 1">Quitar</button>
            </div>
          }
        </div>
        <button type="button" (click)="agregar()">Agregar medicamento</button>

        @if (error()) {
          <small>{{ error() }}</small>
        }
        <div class="acciones">
          <button type="submit">Guardar</button>
          <a routerLink="/recetas">Volver</a>
        </div>
      </form>
    </div>
  `,
    styles: `
    .container { max-width: 800px; margin: 24px auto; padding: 0 16px; font-family: sans-serif; }
    form { display: flex; flex-direction: column; gap: 8px; }
    .fila { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; align-items: flex-start; }
    .fila div { display: flex; flex-direction: column; }
    input, select { padding: 8px; }
    small { color: #c62828; }
    .acciones { display: flex; gap: 16px; align-items: center; margin-top: 12px; }
  `
})
export class RecetaFormComponent {
    private fb = inject(FormBuilder);
    private recetaService = inject(RecetaService);
    private router = inject(Router);

    medicamentos = signal<Medicamento[]>([]);
    error = signal('');

    form = this.fb.nonNullable.group({
        pacienteNombre: ['', [Validators.required, Validators.minLength(5)]],
        detalles: this.fb.array([this.nuevoDetalle()])
    });

    constructor() {
        inject(MedicamentoService).listar().subscribe(m => this.medicamentos.set(m));
    }

    get detalles() {
        return this.form.controls.detalles;
    }

    private nuevoDetalle() {
        return this.fb.nonNullable.group({
            medicamentoId: [null as number | null, Validators.required],
            cantidad: [null as number | null, [Validators.required, positivoValidator]],
            dosisIndicada: ['', Validators.required]
        });
    }

    agregar() {
        this.detalles.push(this.nuevoDetalle());
    }

    quitar(index: number) {
        this.detalles.removeAt(index);
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.recetaService.crear(this.form.getRawValue() as RecetaRequest).subscribe({
            next: () => this.router.navigate(['/recetas']),
            error: err => this.error.set(err.error?.detail ?? 'No se pudo guardar la receta')
        });
    }
}