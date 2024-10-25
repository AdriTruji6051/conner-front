import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ProductsLabelComponent } from './products-label/products-label.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule]
})

export class ProductsComponent{
  constructor(
    private modal : MatDialog,
  ){ }

  //New modals structure ->
  createModal(): void{
    this.modal.open(AddProductComponent,{
      width: '100%',
      minWidth: '320px',
      maxWidth: '600px',
      height: '90vh',
    })
  }

  updateModal(): void{
    this.modal.open(UpdateProductComponent,{
      width: '100%',
      minWidth: '320px',
      maxWidth: '600px',
      height: '90vh',
    })
  }

  deleteModal():void{
    this.modal.open(DeleteProductComponent,{
      width: '100%',
      minWidth: '320px',
      maxWidth: '600px',
    })
  }

  labelsModal(): void{
    this.modal.open(ProductsLabelComponent,{
      width: '100%',
      minWidth: '420px',
      maxWidth: '600px',
    })
  }

}

