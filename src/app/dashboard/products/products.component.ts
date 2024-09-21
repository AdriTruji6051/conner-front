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


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [MatExpansionModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, MatRadioModule, CommonModule, MatDialogModule, ReactiveFormsModule]
})

export class ProductsComponent implements OnInit{
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


  constructor(
    private productsService : ProductsService,
    private modal : MatDialog
  ){}

  codeFormControl: FormControl = new FormControl('', [Validators.required]);
  descriptionFormControl: FormControl = new FormControl('');
  saleTypeFormControl: FormControl = new FormControl('');
  costFormControl: FormControl = new FormControl('');
  salePriceFormControl: FormControl = new FormControl('');
  departMentFormControl = 1;
  wholesaleFormControl: FormControl = new FormControl('');
  priorityFormControl = 0;
  inventoryFormControl = 0;
  profitFormControl: FormControl = new FormControl('');


  ngOnInit(): void {
    this.codeFormControl.valueChanges
    .pipe(debounceTime(1200))
    .subscribe(() => {
      this.checkCodeIsAvaliable();
    })
  }

  checkCodeIsAvaliable(): void{
    const query = this.codeFormControl.value;
    var sameUpdateCode = false;

    //Verify if the code have been searched
    if(this.productToUpdate){
      if(this.productToUpdate.code === query) sameUpdateCode = true;
    }

    if(query && !sameUpdateCode){
      this.productToUpdate = null;
      this.productsService.getProductById(query).subscribe({
        next: (product) => this.codeNotAvaliable(product),
        error: (error) =>{ 
          if(error.status === 404) this.isCodeAvaliable = true;
          else console.log('ERROR INESPERADO!...');
          }
      })
    }
  }

  codeNotAvaliable(product: any): void{
    Swal.fire({
      title: "Código ya existente!",
      html: `<h3>¿Desea cargar los datos para actualizar?</h3><br>
            <p><b>Código:</b> ${product.code}</p><br>
            <p><b>Descripción:</b> ${product.description}</p><br>
            <p><b>Costo:</b> ${product.cost}</p><br>
            <p><b>Precio de venta:</b> ${product.salePrice}</p><br>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Cargar datos"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productToUpdate = product;
        this.isCodeAvaliable = false;

        this.codeFormControl.setValue(product.code);
        this.descriptionFormControl.setValue(product.description);
        this.costFormControl.setValue(product.cost);
        this.profitFormControl.setValue(product.profitMargin);
        this.salePriceFormControl.setValue(product.salePrice);
        this.wholesaleFormControl.setValue(product.wholesalePrice);
        this.saleTypeFormControl.setValue(product.saleType);
      }else{
        this.codeFormControl.setValue('');
      }
    });
  }

  saveProduct(): void{
    const data = {
      code: this.codeFormControl.value,
      description: this.descriptionFormControl.value,
      saleType: this.saleTypeFormControl.value,
      cost: this.costFormControl.value,
      salePrice: this.salePriceFormControl.value,
      department: this.departMentFormControl,
      wholesalePrice: this.wholesaleFormControl.value,
      priority: this.priorityFormControl,
      inventory: this.inventoryFormControl,
      profitMargin: this.profitFormControl.value,
    }

    console.log(data)
  }

  calculatePrice(): void{
    const cost = parseFloat(this.costFormControl.value);
    const profit = parseFloat(this.profitFormControl.value);
    const salePrice = cost + (cost * profit) / 100;
    this.salePriceFormControl.setValue(salePrice);
  }


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
        if(!result) this.productWasNotFound();
        else this.productToDelete = result;
      });
    }

    this.inputDeleteValue = '';
  }

  productWasNotFound(){
    this.productToDelete = null;
    this.deletePlaceholder = 'No hay coincidencias con ese producto!..';
  }

}
