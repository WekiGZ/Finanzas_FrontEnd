import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/mivivienda/usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/listar`);
  }

  login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/login`, usuario).pipe(
      tap((respuesta: Usuario) => {
        if (respuesta.usuario_id != null) {
          localStorage.setItem("usuarioId", respuesta.usuario_id.toString());
        }
      })
    );
  }

  logout() {
    localStorage.removeItem("usuarioId");
  }

  getUsuarioId(): number | null {
    const id = localStorage.getItem("usuarioId");
    return id ? parseInt(id, 10) : null;
  }

  getUsuarioById(usuarioId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/mostrar/${usuarioId}`);
  }

  registro(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/registro`, usuario);
  }

  actualizarCuenta(
    id: number,
    cuenta: {
      edad: number;
      salario: number;
      discapacidad: boolean;
      desplazado: boolean;
      migrante: boolean;
    }
  ): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.baseUrl}/${id}/cuenta`,
      cuenta
    );
  }
}
