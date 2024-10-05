import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticketService/ticket-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-submit-bill',
  template: `
    <div class="m-4 common-container">
    <form #commonForm="ngForm">
        <h1>Registrar venta</h1>
        <hr>
        <h2>Total del ticket: <b>$ {{totalTicket}}</b></h2>
        <h2>Cambio: <b>$ {{paidWith - totalTicket >= 0 ? paidWith - totalTicket : 0.00 }}</b></h2>
    
        <div class="form-group number-inputs py-2">
            <div>
                <label>Cambio</label>
                <input type="number" id="1" [(ngModel)]="paidWith" name="cantity" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" value="1.00" (focus)="selectAllText($event)" autocomplete="off" required>
            </div>
        </div>

        <div class="form-group py-2" [hidden]="false">
            <label for="1">Notas de la venta</label>
            <input type="text" id="2" [(ngModel)]="notes" name="description" class="styled-input" placeholder="Ex. Tipo de embalaje: CAJA" (focus)="selectAllText($event)" autocomplete="off">
        </div>

        <div *ngIf="commonForm.invalid">
            <small>Introduzca datos validos!.</small>
        </div>
        <div *ngIf="paidWith < totalTicket">
            <p>Introduce un cambio valido!.</p>
        </div>
    
        <div class="button-panel">
            <select class="styled-select"  [(ngModel)]="selectedPrinter" [ngModelOptions]="{standalone: true}" (ngModelChange)="changePrinter($event)"> 
                <option *ngFor="let prin of printers; let i = index" [value]="i">{{prin}}</option>
            </select>
            <button type="button" id="4" (click)="submitTicket(false)" class="pdv-btn square-btn" [disabled]="commonForm.invalid || paidWith < totalTicket">Registrar venta!</button>
            <button type="button" id="3" (click)="submitTicket()" class="pdv-btn square-btn" [disabled]="commonForm.invalid || paidWith < totalTicket">Imprimir y registrar venta!</button>
        </div>
    </form>
  </div>
  `,
  styles: [`
    label {
      display: block;
      margin-bottom: 15px;
      font-weight: 500;
      color: #333;
    }

    .number-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .button-panel {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid #e5e5e5;
    }
  `]
})
export class SubmitBillComponent {
  ticket!: any;
  notes!: string;
  paidWith!: any;
  totalTicket!: any;
  enableNotes: boolean = false;
  actualInputId = 2;
  printers!: string[];
  selectedPrinter = 0;

  constructor(
    public dialogRef: MatDialogRef<SubmitBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {ticket : any[], printers: string[]},
    private ticketService: TicketService,
  ){
    this.ticket = this.data.ticket;
    this.printers = this.data.printers;
    this.totalTicket = this.ticket.total;
    this.paidWith = this.ticket.total;
    document.getElementById(this.actualInputId.toString())?.focus();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter' && this.actualInputId != 4){
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }else if(event.key === 'F5') event.preventDefault();
  }

  changePrinter(printerIndex: any): void{
    this.selectedPrinter = printerIndex;
  }

  submitTicket(willPrint: boolean = true): void{
    const sumbitData: any = {
      products: this.ticket.products,
      total: this.ticket.total,
      paidWith: this.paidWith,
      notes: this.notes ? this.notes : '',
      willPrint: willPrint,
      wholesale: this.ticket.wholesale,
      printerName: this.printers[this.selectedPrinter] ? this.printers[this.selectedPrinter] : null
    }

    this.ticketService.createTicket(sumbitData).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Error de servidor",
          text: "El ticket no se pudo guardar, verifique su conexión!",
        });

        this.dialogRef.close();
      } 
    })
    
  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }
}
