import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticketService/ticket-service';
import { btnTextDict } from './buttonsText';
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
            <button type="button" id="4" (click)="submitTicket(false)" class="pdv-btn square-btn" [disabled]="commonForm.invalid || paidWith < totalTicket"><svg xmlns="http://www.w3.org/2000/svg" class="mx-2 fs-4" viewBox="0 -960 960 960"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>{{registerSaleText}}</button>
            <button type="button" id="3" (click)="submitTicket()" class="pdv-btn square-btn" [disabled]="commonForm.invalid || paidWith < totalTicket"><svg xmlns="http://www.w3.org/2000/svg" class="mx-2 fs-4" viewBox="0 -960 960 960"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg> {{printSaleText}}</button>
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

  //HTML Dinamyc
  btnTextDict = btnTextDict;
  registerSaleText!: string;
  printSaleText!: string;

  constructor(
    public dialogRef: MatDialogRef<SubmitBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {ticket : any[], printers: string[]},
    private ticketService: TicketService,
  ){
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));

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
    }else if(event.key === 'F1' || event.key === 'F3' || event.key === 'F4' || event.key === 'F5' ||event.key ===  'F6' || event.key === 'F10' || event.key === 'F11' || event.key === 'F12') {
      event.preventDefault();
    }else if(event.key === 'ArrowDown' && this.actualInputId != 3 || event.key === 'ArrowRight' && this.actualInputId != 4 ){
      event.preventDefault();
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }else if(event.key === 'ArrowUp' && this.actualInputId != 3 || event.key === 'ArrowLeft' && this.actualInputId != 1 ){
      event.preventDefault();
      this.actualInputId--;
      document.getElementById(this.actualInputId.toString())?.focus();
    }
  }

  private onResize(){
    if(window.innerWidth > 1600){
      this.registerSaleText = this.btnTextDict.submit.long;
      this.printSaleText = this.btnTextDict.print.long;
    }
    else if(window.innerWidth <= 1600 && window.innerWidth >= 668){
      this.registerSaleText = this.btnTextDict.submit.medium;
      this.printSaleText = this.btnTextDict.print.medium;
    }
    else{
      this.registerSaleText = this.btnTextDict.submit.small;
      this.printSaleText = this.btnTextDict.print.small;
    }
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
      productsCount: this.ticket.productsCount,
      printerName: this.printers[this.selectedPrinter] ? this.printers[this.selectedPrinter] : null
    }

    this.ticketService.createTicket(sumbitData).subscribe({
      next: (data) => {
        console.log(data);
        this.dialogRef.close(this.paidWith)
      },
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
