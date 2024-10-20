import { Component, ElementRef, OnInit, Query, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 



import {  
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,} from '@angular/forms';

import {NgIf} from '@angular/common';
import { ProductsService } from 'src/app/services/productsService/products.service';
import { SelectProductComponent } from './select-product/select-product.component';
import Swal from 'sweetalert2';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ProductsLabelComponent } from './products-label/products-label.component';


export function priceValidator(costPrice: number): boolean {
  return true
}


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [MatExpansionModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, MatRadioModule, CommonModule, MatDialogModule, ReactiveFormsModule]
})

export class ProductsComponent{
  @ViewChild('searchProductDeletInput', { static: false }) searchDeleteInput!: ElementRef;
  createPanelOpenState = false;
  deletePanelOpenState = false;
  
  inputUpdateValue: string | null = null;
  isCodeAvaliable: boolean = false;
  isUpdating: boolean = false;
  productToUpdate: any = null; //Product to update info

  findedProducts = []; //Array that contains all the finded products

  inputDeleteValue: string | null = null;
  productToDelete: any = null; //Product to delete info
  deletePlaceholder = 'Busca el producto para obtener su información!..';


  //CREATE OR UPDATE Control variable
  codeFormControl: FormControl = new FormControl('', [Validators.required,  Validators.pattern('^(?!.*\\b(SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|--|;|\'|"|\\(|\\))\\b).+$')]);
  descriptionFormControl: FormControl = new FormControl('', [Validators.required,  Validators.pattern('^(?!.*\\b(SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|--|;|\'|"|\\(|\\))\\b).+$')]);
  saleTypeFormControl: FormControl = new FormControl('U', [Validators.required, ]);
  costFormControl: FormControl = new FormControl('', [Validators.pattern('^(\\d+(\\.\\d+)?|\\.\\d+)$')]);
  salePriceFormControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('^(\\d+(\\.\\d+)?|\\.\\d+)$')]);
  departMentFormControl = 1;
  wholesaleFormControl: FormControl = new FormControl('', [Validators.pattern('^(\\d+(\\.\\d+)?|\\.\\d+)$')]);
  priorityFormControl = 0;
  inventoryFormControl = 0;
  profitFormControl: FormControl = new FormControl('', [Validators.required, Validators.pattern('\\d+(\\.\\d+)?') ]);


  
  constructor(
    private productsService : ProductsService,
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
      height: '90vh',
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

