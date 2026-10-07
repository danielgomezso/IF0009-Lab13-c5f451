import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    template: `
    <div class="card">
      <h2>MedPharm Express</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Usuario</label>
        <input formControlName="username" />
        @if (form.controls.username.touched && form.controls.username.errors?.['required']) {
          <small>El usuario es requerido</small>
        }

        <label>Contraseña</label>
        <input type="password" formControlName="password" />
        @if (form.controls.password.touched && form.controls.password.errors?.['required']) {
          <small>La contraseña es requerida</small>
        }
        @if (form.controls.password.touched && form.controls.password.errors?.['minlength']) {
          <small>Mínimo 6 caracteres</small>
        }

        @if (error()) {
          <small>{{ error() }}</small>
        }
        <button type="submit" [disabled]="form.invalid">Ingresar</button>
      </form>
    </div>
  `,
    styles: `
    .card { max-width: 360px; margin: 10vh auto; padding: 24px; border: 1px solid #ddd; border-radius: 8px; font-family: sans-serif; }
    form { display: flex; flex-direction: column; gap: 8px; }
    input { padding: 8px; }
    small { color: #c62828; }
    button { margin-top: 12px; padding: 10px; cursor: pointer; }
  `
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    error = signal('');

    form = this.fb.nonNullable.group({
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    submit() {
        this.auth.login(this.form.getRawValue()).subscribe({
            next: () => this.router.navigate(['/recetas']),
            error: () => this.error.set('Credenciales inválidas')
        });
    }
}