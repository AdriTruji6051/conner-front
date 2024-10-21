import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticketService/ticket-service';

@Component({
  selector: 'app-open-drawer',
  template: `
  <div class="main-container m-2">
    <div class="p-2">
      <h1>¿Quiere abrir el cajón del dinero?</h1>
    </div>
    <div class="button-panel">
      <select class="styled-select" [(ngModel)]="selectedPrinter" [ngModelOptions]="{standalone: true}" (ngModelChange)="changePrinter($event)"> 
          <option *ngFor="let prin of printers; let i = index" [value]="i">{{prin}}</option>
      </select>
      <button type="button" class="pdv-btn outlined-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
      <button 
        type="button"
        class="pdv-btn square-btn" 
        (click)="openDrawer()"
        >Abrir el cajón de dinero</button>
    </div>
  </div>
  `,
  styles: [`
    .main-container{
      min-height: 150px;
      max-height: 70vh;
    }
    
    .labels{
      overflow-y: auto;
    }
  `
  ]
})
export class OpenDrawerComponent {
  constructor(
    public ticketService: TicketService,
    public dialogRef: MatDialogRef<OpenDrawerComponent>
  ){
    this.ticketService.getPrinters().subscribe({
      next: (data: string[]) => this.printers = data,
    })
  }
  
  selectedPrinter: number = 0;
  printers!: string[];


  changePrinter(printerIndex: any): void{
    this.selectedPrinter = printerIndex;
  }
  
  openDrawer(): void{
    const data = {
      printerName: this.printers[this.selectedPrinter] ? this.printers[this.selectedPrinter] : null,
    }

    this.ticketService.openDrawer(data).subscribe({
      next: () => alert('Caja abierta!'),
      error: () => alert('Problemas al abrir la caja!')
    })
  }
}
