import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api';
import { Medicamento } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  private http = inject(HttpClient);

  listar() {
    return this.http.get<Medicamento[]>(`${API_URL}/medicamentos`);
  }
}