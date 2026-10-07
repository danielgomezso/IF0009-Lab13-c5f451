import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Receta } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { RecetaService } from '../../services/receta.service';

type Filtro = 'TODAS' | 'PENDIENTE' | 'DESPACHADA';

@Component({
  selector: 'app-recetas-list',
  imports: [DatePipe, RouterLink],
  template: `
    <div class="container">
      <header>
        <h2>Recetas</h2>
        <div>
          <a routerLink="/nueva-receta">Nueva receta</a>
          <button (click)="auth.logout()">Salir</button>
        </div>
      </header>

      <div class="filtros">
        @for (f of filtros; track f) {
          <button [class.activo]="filtro() === f" (click)="filtro.set(f)">{{ f }}</button>
        }
      </div>

      <div class="tabla">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Medicamentos</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (r of filtradas(); track r.id) {
              <tr>
                <td>{{ r.codigoReceta }}</td>
                <td>{{ r.pacienteNombre }}</td>
                <td>{{ r.medicoNombre }}</td>
                <td>
                  @for (d of r.detalles; track d.medicamentoId) {
                    <div>{{ d.medicamentoNombre }} x{{ d.cantidad }}</div>
                  }
                </td>
                <td>{{ r.fechaEmision | date: 'short' }}</td>
                <td><span [class]="'badge ' + r.estado.toLowerCase()">{{ r.estado }}</span></td>
                <td>
                  @if (r.estado === 'PENDIENTE') {
                    <button (click)="cambiarEstado(r, 'DESPACHADA')">Despachar</button>
                    <button (click)="cambiarEstado(r, 'CANCELADA')">Cancelar</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .container { max-width: 1000px; margin: 24px auto; padding: 0 16px; font-family: sans-serif; }
    header { display: flex; justify-content: space-between; align-items: center; }
    header a { margin-right: 12px; }
    .filtros { margin: 12px 0; display: flex; gap: 8px; }
    .filtros .activo { background: #1976d2; color: #fff; }
    .tabla { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
    .badge { padding: 2px 8px; border-radius: 10px; color: #fff; font-size: 12px; }
    .pendiente { background: #f9a825; }
    .despachada { background: #2e7d32; }
    .cancelada { background: #c62828; }
  `
})
export class RecetasListComponent {
  private service = inject(RecetaService);
  auth = inject(AuthService);

  filtros: Filtro[] = ['TODAS', 'PENDIENTE', 'DESPACHADA'];
  recetas = signal<Receta[]>([]);
  filtro = signal<Filtro>('TODAS');
  filtradas = computed(() =>
    this.filtro() === 'TODAS' ? this.recetas() : this.recetas().filter(r => r.estado === this.filtro())
  );

  constructor() {
    this.service.listar().subscribe(r => this.recetas.set(r));
  }

  cambiarEstado(receta: Receta, estado: string) {
    this.service.cambiarEstado(receta.id, estado).subscribe(actualizada =>
      this.recetas.update(lista => lista.map(r => (r.id === actualizada.id ? actualizada : r)))
    );
  }
}