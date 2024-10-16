import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product',
  template: `
  <div class="m-4 common-container">
    <form (ngSubmit)="submitProduct()" #commonForm="ngForm">
        <div class="form-group py-1" >
            <label for="1">Código:</label>
            <input type="text" id="1" [(ngModel)]="code" name="code" class="styled-input" placeholder="Ex. HUEVOS-3031456" (focus)="selectAllText($event)" autocomplete="off" minlength="3" required>
        </div>

        <div class="form-group py-1" >
            <label for="2">Descripción:</label>
            <input type="text" id="2" [(ngModel)]="description" name="description" class="styled-input" placeholder="Ex. Kilo de huevos" (focus)="selectAllText($event)" autocomplete="off" minlength="3" required>
        </div>
    
        <div class="form-group number-inputs py-1">
            <div>
                <label for="3">Costo del producto:</label>
                <input type="number" id="3" [(ngModel)]="cost" name="cost" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" (focus)="selectAllText($event)" autocomplete="off">
            </div>
            <div>
                <label for="4">Ganancia (%):</label>
                <input type="number" id="4" [(ngModel)]="profitMargin" name="profitMargin" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" (focus)="selectAllText($event)" autocomplete="off" required>
            </div>
        </div>
        <div class="form-group number-inputs py-1">
            <div>
                <label for="5">Precio de venta:</label>
                <input type="number" id="5" [(ngModel)]="salePrice" name="salePrice" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" value="1.00" (focus)="selectAllText($event)" autocomplete="off" required>
                <div *ngIf="salePrice < cost">
                    <small>El precio de venta es mas bajo que el costo!.</small>
                </div>
            </div>
            <div>
                <label for="6">Precio de mayoreo:</label>
                <input type="number" id="6" [(ngModel)]="wholesalePrice" name="wholesalePrice" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" value="0.00" (focus)="selectAllText($event)" autocomplete="off" required>
                <div *ngIf="wholesalePrice < salePrice">
                    <small>El precio de mayoreo es mas bajo que el precio de venta!.</small>
                </div>
            </div>
        </div>

        <div>
          <label for="7">Unidad</label>
            <input type="radio" name="saleType" [(ngModel)]="saleType" id="7" value="U">
          <label for="8">Granel</label>
            <input type="radio" name="saleType" [(ngModel)]="saleType" id="8" value="D">
        </div>

        <hr>
        <div class="form-group number-inputs py-1">
            <div>
                <label for="9">En inventario:</label>
                <input type="number" id="9" [(ngModel)]="inventory" name="inventory" class="styled-input" min="0" pattern="^[0-9]+(\.[0-9]+)?" (focus)="selectAllText($event)" autocomplete="off">
            </div>
        </div>

        <hr>
        <div class="form-grup number-inputs py-1">
          <div>
            <label for="10">Departamento:</label>
            <select id="10" class="styled-select" [(ngModel)]="department">
              <option *ngFor="let dept of departments; let i = index" [value]="i">{{dept.description}}</option>
            </select>
          </div>
          <div>
            <label for="11">Familia:</label>
            <select id="11" class="styled-select" [(ngModel)]="familyCode">
                <option *ngFor="let dept of departments; let i = index" [value]="i">{{dept.description}}</option>
            </select>
          </div>

        </div>

        <div *ngIf="commonForm.invalid">
            <small>Introduzca datos validos!.</small>
        </div>
    
        <div class="button-panel">
            <button type="button" class="pdv-btn outlined-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
            <button type="submit" id="12" class="pdv-btn square-btn" [disabled]="commonForm.invalid || salePrice < 0.01 || cantity < 0.01">Agregar producto</button>
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

    .common-container{
      overflow-y: auto;
      overflow-x: auto;
    }
  `]
})
export class AddProductComponent {
  departments!: any[];

  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
  ){}

  actualInputId = 1;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter' && this.actualInputId != 12){
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }else if(event.key === 'F1' || event.key === 'F3' || event.key === 'F4' || event.key === 'F5' ||event.key ===  'F6' || event.key === 'F10' || event.key === 'F11' || event.key === 'F12'){
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

  code!: string;
  description!: string;
  saleType: string = 'U';

  cost: number = 0.00;
  profitMargin: number = 20;
  salePrice: number = 0.00;
  wholesalePrice: number = 0.00;

  priority:number = 0;
  inventory:number = 0;

  department!: number;
  parentCode!: string;
  familyCode!: string;


  cantity = 1.00;


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
