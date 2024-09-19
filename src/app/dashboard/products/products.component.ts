import { Component } from '@angular/core';
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
import { FindedProductComponent } from './finded-product/finded-product.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [MatExpansionModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, MatRadioModule, CommonModule, MatDialogModule]
})

export class ProductsComponent {
  constructor(
    private productsService : ProductsService,
    private modal : MatDialog
  ){}

  createPanelOpenState = false;
  deletePanelOpenState = false;
  placeholderValue: string | null = null;
  deleteFindedProducts: any | null = null;

  product = [
    {
      code: '1234',
      description: 'hello'
    },
    {
      code: '123456',
      description: 'amlo'
    }
  ]

  searchProductForDelete(): void{
    const modalRef = this.modal.open(FindedProductComponent,{
      width: '500px',
      height: '500px',
      data: { product: this.placeholderValue}
    });

    modalRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  
}
