import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modify-cantity',
  template: `
  <div class="m-4 common-container">
      <form #commonForm="ngForm">      
          <div class="form-group py-2">
              <div>
                  <h3>Descripción: <b>{{product.description}}</b></h3>
                  <h3>Cantidad actual del producto: <b>{{product.cantity}}</b></h3>
                  <input type="number" id="1" [(ngModel)]="newCantity" name="cantity" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" (focus)="selectAllText($event)" autocomplete="off" required>
              </div>
          </div>

          <div *ngIf="newCantity < 1">
              <small>Los precios no son validos!.</small>
          </div>
      
          <div class="button-panel">
              <button type="button" id="3" class="pdv-btn square-btn" [disabled]="commonForm.invalid || newCantity < 1" (click)="applyNewCantity()">Confirmar</button>
              <button type="button" class="pdv-btn square-btn outlined-btn" (click)="dialogRef.close()">Cerrar</button>
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
export class ModifyCantityComponent {
  product!: any;
  actualInputId = 1;
  newCantity!: number;

  constructor(
    public dialogRef: MatDialogRef<ModifyCantityComponent>,
    @Inject (MAT_DIALOG_DATA) public data :{ product: any }
  ){
    this.product = data.product;
    this.newCantity = this.product.cantity;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'F1' || event.key === 'F3' || event.key === 'F4' || event.key === 'F5' ||event.key ===  'F6' || event.key === 'F10' || event.key === 'F11' || event.key === 'F12'){
      event.preventDefault();
    }
  }

  applyNewCantity(): void{
    if (this.newCantity > 0){
      this.product.cantity = this.newCantity;
      this.dialogRef.close(this.product);
    }
  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }
}
