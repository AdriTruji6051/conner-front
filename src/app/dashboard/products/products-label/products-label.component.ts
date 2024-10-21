import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/productsService/products.service';
import { TicketService } from 'src/app/services/ticketService/ticket-service';

@Component({
  selector: 'app-products-label',
  template: `
  <div class="main-container m-2">
    <div class="p-2">
      <h3>Impresión de etiquetas</h3>
      <h3>Seleccione la fecha en la que modifico los productos que quiere imprimir</h3>
      <input type="date" [(ngModel)]="date" (ngModelChange)="searchNewDates()">
      <h3 class="my-2">Ó agrega la etiqueta a imprimir</h3>
      <app-product-browser (productForParent)="addProductLabel($event)"></app-product-browser>
    </div>
    <div class="labels p-1" *ngIf="productsLabel">
      <hr>
      <label class="checkbox-wrapper" *ngFor="let product of productsLabel">
          <b>{{product.description}}</b> | $<b>{{product.salePrice}}</b>
          <input type="checkbox" checked="checked" (change)="onCheckboxChange($event, product)">
          <span class="checkmark"></span>
      </label>
    </div>
    <div class="button-panel">
      <select class="styled-select" [(ngModel)]="selectedPrinter" [ngModelOptions]="{standalone: true}" (ngModelChange)="changePrinter($event)"> 
          <option *ngFor="let prin of printers; let i = index" [value]="i">{{prin}}</option>
      </select>
      <button type="button" class="pdv-btn outlined-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
      <button 
        [ngClass]="{'disabled-btn': labelsToPrint.length < 1}"
        type="button"
        class="pdv-btn square-btn" 
        (click)="printLabels()"
        >Imprimir etiquetas</button>
    </div>
  </div>
  `,
  styles: [`
    .main-container{
      min-height: 400px;
      max-height: 70vh;
    }
    
    .labels{
      overflow-y: auto;
    }
  `]
})
export class ProductsLabelComponent {
  constructor(
    public productsService: ProductsService,
    public ticketService: TicketService,
    public dialogRef: MatDialogRef<ProductsLabelComponent>
  ){
    this.ticketService.getPrinters().subscribe({
      next: (data) => this.printers = data,
    })
  }

  date!: string;
  productsLabel: any[] = [];
  labelsToPrint: any[] = [];
  selectedPrinter: number = 0;
  printers!: string[];

  searchNewDates(): void{
    this.productsService.getProductsLabelDay(this.date).subscribe({
      next: (data) => {
        this.labelsToPrint = data.map(({description, salePrice}: any) => ({description, salePrice}))
        this.productsLabel = this.labelsToPrint;
      }
    })
  }

  addProductLabel(product: any): void{
    const data = {
      description: product.description,
      salePrice: product.salePrice
    }
    this.productsLabel.unshift(data);
    this.labelsToPrint.push(data);
  }

  onCheckboxChange(event: Event, product: any): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      // Agrega el objeto al array de seleccionados
      this.labelsToPrint.push(product);
    } else {
      // Elimina el objeto del array si fue deseleccionado
      this.labelsToPrint = this.labelsToPrint.filter(obj => obj != product);
    }
  }

  changePrinter(printerIndex: any): void{
    this.selectedPrinter = printerIndex;
  }
  
  printLabels(): void{
    const data = {
      labels: this.labelsToPrint,
      printerName: this.printers[this.selectedPrinter] ? this.printers[this.selectedPrinter] : null,
    }

    this.productsService.printLabels(data).subscribe({
      next: () => alert('Impresión exitosa de etiquetas!'),
      error: () => alert('No se pudo imprimir correctamente!...')
    })
  }
}
