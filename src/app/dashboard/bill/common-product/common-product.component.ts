import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-product',
  template: `
    <div class="m-4 common-container">
    <form (ngSubmit)="submitProduct()" #commonForm="ngForm">
        <div class="form-group py-2" >
            <label for="1">Nombre del producto</label>
            <input type="text" id="1" [(ngModel)]="description" name="description" class="styled-input" placeholder="Ex. Kilo de huevos" (focus)="selectAllText($event)" autocomplete="off" required minlength="3">
        </div>
    
        <div class="form-group number-inputs py-2">
            <div>
                <label for="number1">Cantidad</label>
                <input type="number" id="2" [(ngModel)]="cantity" name="cantity" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" value="1.00" (focus)="selectAllText($event)" autocomplete="off" required>
            </div>
            <div>
                <label for="number2">Precio</label>
                <input type="number" id="3" [(ngModel)]="salePrice" name="salePrice" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" value="0.00" (focus)="selectAllText($event)" autocomplete="off" required>
            </div>
        </div>
        <div *ngIf="commonForm.invalid">
            <small>Introduzca datos validos!.</small>
        </div>
        <div *ngIf="salePrice < 0.01 || cantity < 0.01">
            <small>Los precios no son validos!.</small>
        </div>
    
        <div class="button-panel">
            <button type="submit" id="4" class="pdv-btn square-btn" [disabled]="commonForm.invalid || salePrice < 0.01 || cantity < 0.01">Agregar</button>
            <button type="button" class="pdv-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
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
export class CommonProductComponent {

  constructor(
    public dialogRef: MatDialogRef<CommonProductComponent>,
  ){}

  actualInputId = 1;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter' && this.actualInputId != 4){
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }else if(event.key === 'F5') event.preventDefault();
  }

  description!: string;
  cantity = 1.00;
  salePrice = 0.00;

  submitProduct(): void{
    const prod = {
      code: `${Math.floor(Math.random() * 20)}-${this.description}`,
      description: this.description,
      saleType: 'U',
      cost: null,
      salePrice: this.salePrice,
      wholesalePrice: null,
      cantity: this.cantity,
    }

    this.dialogRef.close(prod);
  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }
}
