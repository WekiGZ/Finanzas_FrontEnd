import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { HomeService } from '../../services/home-service';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-registro-component',
  standalone: false,
  templateUrl: './registro-component.html',
  styleUrls: ['./registro-component.css'],
})
export class RegistroComponent {
  nombre = '';
  password = '';
  confirmarPassword = '';
  mensaje = '';
  mensajeTipo: 'info' | 'error' | '' = '';

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  actualizarValor(prop: 'nombre' | 'password' | 'confirmarPassword', event: Event) {
    this[prop] = (event.target as HTMLInputElement).value;
  }

  registrar(event: Event) {
    event.preventDefault();
    this.mensaje = '';
    this.mensajeTipo = '';

    if (!this.nombre.trim() || !this.password.trim()) {
      this.mensaje = 'Completa todos los campos para continuar.';
      this.mensajeTipo = 'error';
      return;
    }

    if (this.password.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      this.mensajeTipo = 'error';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden.';
      this.mensajeTipo = 'error';
      return;
    }

    localStorage.setItem(
      'registeredUser',
      JSON.stringify({ nombre: this.nombre.trim(), password: this.password })
    );

    alert(this.nombre);

    const nuevoUsuario: Usuario = {
      usuario_id: null,
      username: this.nombre,
      password: this.password,
      salario: 0,
      edad: 0,

      discapacidad: false,
      desplazado: false,
      migrante: false
    }

    this.usuarioService.registro(nuevoUsuario).subscribe({
      next: (response) =>{
        window.alert("Usuario Registrado");
        this.irALogin();
      },
      error: (err) =>{
        console.error("Error al registrar usuario");
      }
    })

    this.mensaje = 'usuario registrado';
    this.mensajeTipo = 'info';
    //setTimeout(() => this.router.navigate(['/']), 900);
  }

  irALogin() {
    this.router.navigate(['/']);
  }
}