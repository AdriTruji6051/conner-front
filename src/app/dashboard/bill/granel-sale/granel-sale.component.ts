import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-granel-sale',
  template: `
  <div class="m-4 common-container">
      <form #commonForm="ngForm">      
          <div class="form-group number-inputs py-2">
              <div>
                  <label for="number1">Cantidad</label>
                  <input type="number" id="1" [(ngModel)]="cantity" name="cantity" (input)="inputCantity()" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" value="1.00" (focus)="selectAllText($event)" autocomplete="off" required>
              </div>
              <div>
                  <label for="number2">Importe</label>
                  <input type="number" id="2" [(ngModel)]="salePrice" name="salePrice" (input)="inputPrice()" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" value="0.00" (focus)="selectAllText($event)" autocomplete="off" required>
              </div>
          </div>
          <div>
              <h2>Precio del producto: <b>{{product.salePrice}}</b></h2>
          </div>

          <div *ngIf="cantity < 0.01">
              <small>Los precios no son validos!.</small>
          </div>
      
          <div class="button-panel">
              <button type="button" id="3" class="pdv-btn square-btn" [disabled]="commonForm.invalid || cantity < 0.01" (click)="submitProduct()">Agregar</button>
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
export class GranelSaleComponent {
  actualInputId = 1;
  product!: any;

  cantity = 1.00;
  salePrice = 0.00;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter' && this.actualInputId != 4){
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }else if(event.key === 'F1' || event.key === 'F3' || event.key === 'F5' ||event.key ===  'F6' || event.key === 'F10') {
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

  constructor(
    public dialogRef: MatDialogRef<GranelSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {product : any[]}
  ){
    this.product = this.data.product;
    this.salePrice = this.product.salePrice;
  }

  submitProduct(): void{
    const prod = {
      code: this.product.code,
      description: this.product.description,
      saleType: this.product.saleType,
      cost: this.product.cost,
      salePrice: this.product.salePrice,
      wholesalePrice: this.product.wholesalePrice,
      cantity: this.cantity,
    }

    this.dialogRef.close(prod);
  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }

  inputCantity(): void{
    this.salePrice = parseFloat((this.cantity * this.product.salePrice).toFixed(2));
  }

  inputPrice(): void{
    this.cantity = parseFloat((this.salePrice / this.product.salePrice).toFixed(3));
  }


}
