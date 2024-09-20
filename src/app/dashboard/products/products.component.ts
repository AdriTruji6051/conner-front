import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 

import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import { ProductsService } from 'src/app/services/productsService/products.service';
import { SelectProductComponent } from './select-product/select-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [MatExpansionModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, MatRadioModule, CommonModule, MatDialogModule]
})

export class ProductsComponent {
  @ViewChild('searchProductDeletInput', { static: false }) searchDeleteInput!: ElementRef;
  constructor(
    private productsService : ProductsService,
    private modal : MatDialog
  ){}

  createPanelOpenState = false;
  deletePanelOpenState = false;
  inputDeleteValue: string | null = null;

  findedProducts = []; //Array that contains all the finded products

  productToDelete: any = null; //Product to delete info
  deletePlaceholder = 'Busca el producto para obtener su información!..';

  searchProductForDelete(){
    if(this.inputDeleteValue){
      this.productsService.getProduct(this.inputDeleteValue).subscribe({
        next: (data) => this.findedProducts = data,
        error: () => this.productWasNotFound(),
        complete: () => this.processDeleteFindedProducts()
      });
    }
  }

  processDeleteFindedProducts(){
    if(this.findedProducts.length === 1){
      this.productToDelete = this.findedProducts[0]
    }
    else{
      const modalRef = this.modal.open(SelectProductComponent,{
        width: '70%',
        height: '80%',
        data: { products: this.findedProducts}
      });

      modalRef.afterClosed().subscribe(result => {
        if(!result.code) this.productWasNotFound();
        else this.productToDelete = result;
        
      });
    }

    this.inputDeleteValue = '';
  }

  productWasNotFound(){
    this.productToDelete = null;
    this.deletePlaceholder = 'No hay coincidencias con ese producto!..';
  }

  wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
