import { ChangeDetectorRef, Component } from '@angular/core';
import { PropiedadService } from '../../services/propiedad-service';
import { Propiedad } from '../../models/propiedad';
import { HomeService } from '../../services/home-service';
import { Router } from '@angular/router';
import { PlanService } from '../../services/plan-service';
import { Plan } from '../../models/plan-pago';
import { UsuarioService } from '../../services/usuario-service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {

  propiedades: Propiedad[] = [];
  planes: Plan[] = [];
  menuDesplegado: boolean = true;
  vistaActual: string;
  filtroActual: string = "Precio";

  usuarioLogeado: Usuario | undefined;

  mensajeCuenta: string | null = null;
  tipoMensajeCuenta: 'ok' | 'error' | null = null;

  constructor(private propiedadService: PropiedadService, private homeService: HomeService, private router: Router, private planService: PlanService, private usuarioService: UsuarioService, private cdr: ChangeDetectorRef){
    this.vistaActual = homeService.getVista();
  }

  ngOnInit(){
    this.cargarPropiedades();
    this.cargarPlanes();

    this.cargarUsuario();

    this.cdr.detectChanges();
  }

  cargarPropiedades(){
    this.propiedadService.getPropiedades().subscribe({
      next: (data) => {
        this.propiedades = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error", err);
      }
    });
  }

  cargarPlanes(){
    const usuarioId = this.usuarioService.getUsuarioId();
    if (usuarioId) {
      this.planService.getPlanesPorUsuario((usuarioId)).subscribe({
        next: (planes) => {
          this.planes = planes;
          this.cdr.detectChanges();
          for (let plan of this.planes) {
            if (plan.propiedad_id) {
              this.propiedadService.getPropiedadById(plan.propiedad_id).subscribe({
                next: (vivienda) => {
                  plan.nombrePropiedad = vivienda.nombre;
                  this.cdr.detectChanges();
                },
                error: (err) => {
                  console.error("Error fetching vivienda:", err);
                  alert("q malaso");
                }
              });
            }else{
              alert("no encontre propiedad id ptmrrrrrrrrr");
            }
          }

        },
        error: (err) => {
          console.error("Error", err);
        }
      });
    }
  }

  desplegarMenu(){
    this.menuDesplegado = !this.menuDesplegado
  }

  cambiarVista(vista: string){
    this.vistaActual = vista;
  }

  cambiarFiltro(filtro: string){
    if(filtro == this.filtroActual){
      this.filtroActual = "";
    }else{
      this.filtroActual = filtro
    }
  }

  crearPlan(vivienda_id: number){
    this.router.navigate(['/crear/' + vivienda_id]);
  }
  mostrarPlan(plan_id: number){
    this.router.navigate(['/mostrar/' + plan_id]);
  }
  getVivienda(vivienda_id: number): void {
    this.propiedadService.getPropiedadById(vivienda_id).subscribe({
      next: (vivienda) => {
        const nombre = vivienda.nombre;

      },
      error: (err) => {
        console.error("Error fetching vivienda:", err);
      }
    });
  }

  getUsuarioId(){
    return this.usuarioService.getUsuarioId();
  }
  getUsuario(id: number){
    return this.usuarioService.getUsuarioById(id);
  }
  cargarUsuario(){
    const usuarioId = this.getUsuarioId();
    if(usuarioId){
      this.usuarioService.getUsuarioById(usuarioId).subscribe({
        next: (usuario) =>{
          this.usuarioLogeado = usuario;
        },
        error: (err) =>{

        }
      })
    }
  }

  guardarCuenta(): void {
    if (!this.usuarioLogeado || this.usuarioLogeado.usuario_id == null) {
      this.mensajeCuenta = 'No se encontró el usuario.';
      this.tipoMensajeCuenta = 'error';
      return;
    }

    const id = this.usuarioLogeado.usuario_id;

    const body = {
      edad: this.usuarioLogeado.edad,
      salario: this.usuarioLogeado.salario,
      discapacidad: this.usuarioLogeado.discapacidad,
      desplazado: this.usuarioLogeado.desplazado,
      migrante: this.usuarioLogeado.migrante
    };

    this.usuarioService.actualizarCuenta(id, body).subscribe({
      next: (usuarioActualizado) => {
        this.usuarioLogeado = usuarioActualizado;
        this.mensajeCuenta = 'Datos de cuenta actualizados correctamente.';
        this.tipoMensajeCuenta = 'ok';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar cuenta', err);
        this.mensajeCuenta = 'Ocurrió un error al guardar los cambios.';
        this.tipoMensajeCuenta = 'error';
      }
    });
  }
}
