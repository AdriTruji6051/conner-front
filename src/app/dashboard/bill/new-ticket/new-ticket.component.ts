import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-ticket',
  template: `
    <div class="m-4 common-container">
    <form (ngSubmit)="createTicket()" #commonForm="ngForm">
        <div class="form-group py-2" >
            <label for="1">Nombre del producto</label>
            <input type="text" id="1" [(ngModel)]="ticketName" name="description" class="styled-input" placeholder="Ex. Ticket 4" (focus)="selectAllText($event)" autocomplete="off" required minlength="3">
        </div>
    
        <div *ngIf="commonForm.invalid">
            <small>Introduzca datos validos!.</small>
        </div>
    
        <div class="button-panel">
            <button type="button" class="pdv-btn outlined-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
            <button type="submit" id="4" class="pdv-btn  square-btn" [disabled]="commonForm.invalid">Crear ticket</button>
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
export class NewTicketComponent {
  ticketName!: string;

  constructor(
    public dialogRef: MatDialogRef<NewTicketComponent>,
  ){}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'F1' || event.key === 'F3' || event.key === 'F5' ||event.key ===  'F6' || event.key === 'F10'){
      event.preventDefault();
    }
  }

  createTicket(): void{
    this.dialogRef.close(this.ticketName);
  }

  selectAllText(event: any): void{
    event.target.select();
  }
}
