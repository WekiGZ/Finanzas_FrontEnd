import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { HomeComponent } from './components/home-component/home-component';
import { CrearPlanComponent } from './components/crear-plan-component/crear-plan-component';
import { MostrarPlanComponent } from './components/mostrar-plan-component/mostrar-plan-component';
import { RegistroComponent } from './components/registro-component/registro-component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'crear/:id', component: CrearPlanComponent },
  { path: 'mostrar/:id', component: MostrarPlanComponent },
  { path: 'registro', component: RegistroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
