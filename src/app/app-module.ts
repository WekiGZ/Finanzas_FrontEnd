import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LoginComponent } from './components/login-component/login-component';
import { HomeComponent } from './components/home-component/home-component';
import { MaterialModule } from './modules/material/material-module';
import { CrearPlanComponent } from './components/crear-plan-component/crear-plan-component';
import { MostrarPlanComponent } from './components/mostrar-plan-component/mostrar-plan-component';
import { RegistroComponent } from './components/registro-component/registro-component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    HomeComponent,
    CrearPlanComponent,
    MostrarPlanComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
