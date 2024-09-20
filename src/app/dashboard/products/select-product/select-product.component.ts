import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';

interface Products{
  code: string;
  description: number;
  saleType: string;
  cost: number;
  salePrice: number;
  wholesalePrice: number;
  priority: any;
  inventory: any;
  modifiedAt: string;
  profitMargin: number;
}

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

  displayedColumns: string[] = ['description', 'salePrice'];

  products: Products[] = this.data.products;

  productRow = {
    code: ''
  }

  closeModal(): void{
    console.log('close')
    this.dialogRef.close(this.productRow);
  }

  selectedProdcut(row: any) {
    this.productRow = row;
  }

  onKeyPress(event: KeyboardEvent): void{
    const key = event.key
    console.log(key);
    if(key === 'Enter'){
      console.log('Enter was checked!');
      this.closeModal();
    }
  }
}
