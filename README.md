# MedPharm Express - Laboratorio 13 (IF0009)

Plataforma de gestión de recetas médicas y despacho de farmacia.

- **Backend:** `medpharm-backend` (Spring Boot 3, Spring Security + JWT, H2 en memoria)
- **Frontend:** `medpharm-frontend` (Angular 19 Standalone, Formularios Reactivos, Signals)

## Ejecución

Backend (puerto 8080):

```bash
cd medpharm-backend
mvn spring-boot:run
```

Frontend (puerto 4200):

```bash
cd medpharm-frontend
npm install
ng serve
```

Usuarios de prueba (contraseña `password123`): `medico1` (MEDICO) y `farma1` (FARMACEUTICO).

## Informe de depuración: error 401 Unauthorized

### Procedimiento

Se retiró temporalmente `authInterceptor` de `app.config.ts` (`provideHttpClient()` sin `withInterceptors`)
y se consumió `GET /api/v1/recetas`. La petición fue rechazada con estado HTTP 401.

### Por qué el servidor rechazó la petición

La API es *stateless*: no mantiene sesiones y exige que cada petición demuestre quién es el usuario.
El único endpoint público es `/api/v1/auth/login`; el resto requiere autenticación.

Al llamar a `/api/v1/recetas` sin el encabezado `Authorization: Bearer <token>`:

1. `AuthTokenFilter` no encuentra token, por lo que no valida nada ni establece una autenticación en el
   `SecurityContext`.
2. La regla `anyRequest().authenticated()` detecta que el contexto está vacío y deniega el acceso.
3. El `AuthenticationEntryPoint` configurado responde con HTTP 401 Unauthorized.

El usuario sí había iniciado sesión y el token estaba guardado en `localStorage`, pero Angular nunca lo
adjuntó a la petición, porque `HttpClient` no agrega encabezados de autenticación por sí solo.

Las peticiones de preflight CORS (`OPTIONS`) no se ven afectadas, ya que `SecurityConfig` las permite y el
origen `http://localhost:4200` está habilitado con el encabezado `Authorization`.

### Cómo lo resuelve el interceptor HTTP

`authInterceptor` es un `HttpInterceptorFn` registrado con `provideHttpClient(withInterceptors([authInterceptor]))`,
por lo que intercepta todas las peticiones salientes de `HttpClient`. Como `HttpRequest` es inmutable, el
interceptor obtiene el token desde `AuthService` y, si existe, clona la petición agregando
`Authorization: Bearer <token>` antes de pasarla al siguiente manejador (`next`).

De este modo `AuthTokenFilter` recibe el token, valida su firma y expiración con `JwtUtils`, carga el usuario
y establece la autenticación, lo que permite que la petición llegue al controlador.