import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import { Product } from './products';


@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css'],
  standalone: true,
  imports: [MatTableModule, CommonModule]
})

export class SelectProductComponent {
  constructor(
    public dialogRef: MatDialogRef<SelectProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {products : any[]}
  ){}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    if(key === 'Enter') this.sendProdcut();
    else if(key === 'ArrowDown') this.nextProduct();
    else if(key === 'ArrowUp') this.previousProduct();
  }


  displayedColumns: string[] = ['description', 'salePrice'];

  products: Product[] = this.data.products;

  productRow = this.products[0];
  productRowIndex = 0;

  sendProdcut(): void{
    this.dialogRef.close(this.productRow);
  }

  closeModal(): void{
    this.dialogRef.close(null);
  }

  selectedProdcut(row: any) {
    this.productRowIndex = this.products.findIndex(obj => row == obj);
    this.productRow = row;
  }

  nextProduct(): void{
    if(this.productRowIndex < this.products.length - 1) this.selectedProdcut(this.products[this.productRowIndex + 1]);
  }

  previousProduct(): void{
    if(this.productRowIndex > 0) this.selectedProdcut(this.products[this.productRowIndex - 1]);
  }
}
