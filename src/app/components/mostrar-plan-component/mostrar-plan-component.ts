import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../services/propiedad-service';
import { PlanService } from '../../services/plan-service';
import { Cuota } from '../../models/cuota';
import { HomeService } from '../../services/home-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mostrar-plan-component',
  standalone: false,
  templateUrl: './mostrar-plan-component.html',
  styleUrl: './mostrar-plan-component.css',
})
export class MostrarPlanComponent {
  planId: number = 0;
  cuotas: Cuota[] = [];

  tasaDescuento: number = 0;
  van: number = 0;
  tir: number = 0;

  presicionTir: number = 2500;
  tirAceptada: boolean = false;

  dataSource = new MatTableDataSource<Cuota>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  displayedColumns: string[] = ['nCuota', 'TEM', 'saldoInicial', 'interes', 'cuota', 'amortizacion', 'riesgo', 'desgravamen', 'portes', 'comision', 'saldoFinal', 'flujo'];

  menuDesplegado: boolean = true;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private propiedadService: PropiedadService, private router: Router, private planService: PlanService, private homeService: HomeService){

  }

  ngOnInit(){
    this.cargarPlan();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
  }


  cargarPlan() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.planId = parseInt(id, 10);

        this.planService.getPlanById(this.planId).subscribe({
          next: (plan) => {
            this.planService.crearCuotas(plan).subscribe({
              next: async (cuotas) => {
                this.cuotas = cuotas;
                this.dataSource.data = cuotas;
                this.cdr.detectChanges();
                this.tasaDescuento = ((1 + plan.cok) ** (30/360)) - 1;
                this.tasaDescuento = parseFloat(this.tasaDescuento.toFixed(4));
                let inversionInicial = (plan.precioPropiedad - plan.cuotaInicial + plan.costoNotarial + plan.costoRegistral + plan.tasacion + plan.comisionDeEstudio + plan.comisionPorActivacion) * (-1);
                let flujosFuturos = 0;
                for(let i = 0; i < plan.plazoPrestamo * 12; i++){
                  flujosFuturos += (cuotas[i].flujo)/((1 + this.tasaDescuento)**(i + 1)); 
                }
                this.van = parseFloat((flujosFuturos + inversionInicial).toFixed(2));
                inversionInicial *= -1;
                while(this.tirAceptada == false){
                  flujosFuturos = 0;
                  for(let j = 0; j < plan.plazoPrestamo * 12; j++){
                    flujosFuturos += (cuotas[j].flujo/((1 + this.tir)**(j + 1)));
                  }
                  //alert("flujos futuros: " + flujosFuturos);
                  //alert("inversion inicial: " + inversionInicial);
                  //alert(inversionInicial - flujosFuturos);
                  if(inversionInicial <= flujosFuturos + this.presicionTir && inversionInicial >= flujosFuturos - this.presicionTir){
                    this.tirAceptada = true;
                    parseFloat(this.tir.toFixed(4));
                  }else{
                    if(inversionInicial > flujosFuturos){
                      this.tir -= (0.00009574)
                    }else{
                      this.tir += (0.000097392)
                    }
                  }
                  await this.sleep(50);
                }
              },
              error: (err) => {
                console.error("Error al generar las cuotas", err);
              }
            });
          },
          error: (err) => {
            console.error("Error al encontrar el plan", err);
          }
        });
      }
    });
  }

  desplegarMenu(){
    this.menuDesplegado = !this.menuDesplegado
  }

  cambiarVista(vista: string){
    this.homeService.cambiarVista(vista);
    this.router.navigate(['/home']);
  }
}
