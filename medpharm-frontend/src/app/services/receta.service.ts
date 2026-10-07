import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api';
import { Receta, RecetaRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private http = inject(HttpClient);

  listar() {
    return this.http.get<Receta[]>(`${API_URL}/recetas`);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch<Receta>(`${API_URL}/recetas/${id}/estado`, { estado });
  }

  crear(payload: RecetaRequest) {
    return this.http.post<Receta>(`${API_URL}/recetas`, payload);
  }
}