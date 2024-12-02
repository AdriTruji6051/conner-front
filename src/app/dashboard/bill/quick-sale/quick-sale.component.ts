import { Component, HostListener} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticketService/ticket-service';

@Component({
  selector: 'app-quick-sale',
  template: `
  <div class="main-container m-4">
    <div class="p-2">
      <h1>Venta rápida</h1>
      <h4>Ingresa el monto de la venta</h4>
      <input type="number" class="styled-input" [(ngModel)]="quickSaleCantity">
      <small class="mx-1" *ngIf="quickSaleCantity < 1">Cantidad no valida!</small>
    </div>

    <div class="button-panel">
      <select class="styled-select" [(ngModel)]="selectedPrinter" [ngModelOptions]="{standalone: true}" (ngModelChange)="changePrinter($event)"> 
          <option *ngFor="let prin of printers; let i = index" [value]="i">{{prin}}</option>
      </select>
      <button type="button" class="pdv-btn outlined-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
      <button
        [ngClass]="{'disabled-btn': quickSaleCantity < 1}"
        type="button"
        class="pdv-btn square-btn" 
        (click)="submitTicket()"
        >Registrar</button>
    </div>
  </div>
  `,
  styles: [
    `
    .main-container{
      min-height: 150px;
      max-height: 70vh;
    }
    
    .labels{
      overflow-y: auto;
    }
  `
  ],
  
})
export class QuickSaleComponent {
  constructor(
    public ticketService: TicketService,
    public dialogRef: MatDialogRef<QuickSaleComponent>
  ){
    this.ticketService.getPrinters().subscribe({
      next: (data: string[]) => this.printers = data,
    })
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter'){
      this.submitTicket();
    }else if(event.key === 'F1'){
      event.preventDefault();
      this.submitTicket();
    }else if(event.key === 'F2'){
      event.preventDefault();
      this.submitTicket();
    }else if(event.key === 'F3' || event.key === 'F5' || event.key === 'F4' || event.key ===  'F6' ||event.key ===  'F7' || event.key === 'F10' || event.key === 'F11' || event.key === 'F12') {
      event.preventDefault();
    }
  }
  
  selectedPrinter: number = 0;
  printers!: string[];
  quickSaleCantity!: number;
  isSubmiting!: boolean;

  submitTicket(): void{
    if(this.isSubmiting || this.quickSaleCantity < 1) return
    this.isSubmiting = true;

    const cost = this.quickSaleCantity - (this.quickSaleCantity * 10 / 100)
    const sumbitData: any = {
      products: [
        {
            cantity: 1,
            code: 'QUICK-SALE',
            cost: cost,
            description: 'VENTA RÁPIDA',
            import: this.quickSaleCantity,
            salePrice: this.quickSaleCantity,
            wholesalePrice: this.quickSaleCantity
        }
    ],
      total: this.quickSaleCantity,
      paidWith: this.quickSaleCantity,
      notes: '',
      willPrint: false,
      wholesale: 0,
      productsCount: 1,
      printerName: this.printers[this.selectedPrinter] ? this.printers[this.selectedPrinter] : null
    }

    this.ticketService.createTicket(sumbitData).subscribe({
      next: (data) => {
        this.dialogRef.close({
          paidWith: this.quickSaleCantity,
          folio: data.folio,
          printerName: this.printers[this.selectedPrinter] ? this.printers[this.selectedPrinter] : null
        });
        this.isSubmiting = false;
      },
      error: () => {
        this.dialogRef.close();
        this.isSubmiting = false;
      } 
    })
    
  }


  changePrinter(printerIndex: any): void{
    this.selectedPrinter = printerIndex;
  }
  
}
