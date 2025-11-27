import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario-service';

interface RegisteredUser {
  nombre: string;
  correo: string;
  password: string;
}

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  correo = '';
  password = '';
  mensaje = '';
  mensajeTipo: 'info' | 'error' | '' = '';

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  actualizarCorreo(event: Event) {
    this.correo = (event.target as HTMLInputElement).value;
  }

  actualizarPassword(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  intentarIngresar(event: Event) {
    event.preventDefault();
    this.mensaje = '';
    this.mensajeTipo = '';

    const usuarioLogin: Usuario = {
      usuario_id: 0,
      username: this.correo,
      password: this.password,

      edad: 0,
      salario: 0,

      discapacidad: false,
      migrante: false,
      desplazado: false
    }

    alert("Loggin in");
    

    this.usuarioService.login(usuarioLogin).subscribe({
      next: (response) => {
        alert("exito");
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.warn("Error en Login")
      }
    })

    this.mensaje = 'Ingreso exitoso. Redirigiendo...';
    this.mensajeTipo = 'info';
    //setTimeout(() => this.router.navigate(['/home']), 500);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}