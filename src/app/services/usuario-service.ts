import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/mivivienda/usuarios';

  constructor(private http: HttpClient){

  }

  getUsuarios(){
    return this.http.get<Usuario[]>(`${this.baseUrl}/listar`);
  }

  login(usuario: Usuario) {
    return this.http.post<Usuario>(`${this.baseUrl}/login`, usuario).pipe(
      tap((respuesta: Usuario) => {
        if(respuesta.usuario_id){
          localStorage.setItem("usuarioId", respuesta.usuario_id.toString());
        }
      })
    );
  }

  logout(){
    localStorage.removeItem("usuarioId")
  }

  getUsuarioId(): number | null {
    const id = localStorage.getItem("usuarioId");
    return id ? parseInt(id, 10) : null;
  }

  getUsuarioById(usuarioId: number){
    return this.http.get<Usuario>(`${this.baseUrl}/mostrar/${usuarioId}`);
  }

  registro(usuario: Usuario){
    return this.http.post<Usuario>(`${this.baseUrl}/registro`, usuario)
  }

  usuario: Usuario = {
    usuario_id: 1,
    username: "UserPrueba",
    password: "PasswordPrueba",

    salario: 4000,
    edad: 50,

    discapacidad: true,
    desplazado: false,
    migrante: false
  }
}
