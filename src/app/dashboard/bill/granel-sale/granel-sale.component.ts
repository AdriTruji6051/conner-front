import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-granel-sale',
  template: `
  <div class="m-4 common-container">
      <form (ngSubmit)="submitProduct()" #commonForm="ngForm">      
          <div class="form-group number-inputs py-2">
              <div>
                  <label for="number1">Cantidad</label>
                  <input type="number" id="1" [(ngModel)]="cantity" name="cantity" class="styled-input" min="0" pattern="^[0-9]+" value="1.00" (focus)="selectAllText($event)" autocomplete="off" required>
              </div>
              <div>
                  <label for="number2">Importe</label>
                  <input type="number" id="2" [(ngModel)]="salePrice" name="salePrice" class="styled-input" min="0" pattern="^[0-9]+" value="0.00" (focus)="selectAllText($event)" autocomplete="off" required>
              </div>
          </div>
          <div>
              <h3>Precio del producto: {{product.salePrice}}</h3>
          </div>

          <div *ngIf="cantity < 0.01">
              <small>Los precios no son validos!.</small>
          </div>
      
          <div class="button-panel">
              <button type="submit" id="3" class="pdv-btn square-btn" [disabled]="commonForm.invalid || cantity < 0.01">Agregar</button>
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
export class GranelSaleComponent {

  constructor(
    public dialogRef: MatDialogRef<GranelSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {product : any[]}
  ){
    this.product = this.data.product;
  }

  actualInputId = 1;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter' && this.actualInputId != 3){
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }
  }
  
  product!: any;
  

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
      import: this.cantity * this.salePrice,
    }

    this.dialogRef.close(prod);
  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }
}
