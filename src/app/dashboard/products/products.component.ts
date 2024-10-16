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


  ngOnInit(): void {
    this.codeFormControl.valueChanges
    .pipe(debounceTime(1200))
    .subscribe(() => {
      this.checkCodeIsAvaliable();
    })
  }


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
      minWidth: '320px',
      maxWidth: '600px',
      height: '90vh',
    })
  }
  //END - >New modals structure

  //VALIDATORS and HELPERS
  ispPoductDataValid(): boolean{
    //TO FIX wholesale validator price is not working
    if(this.wholesaleFormControl.value && this.costFormControl.value){
      if(this.wholesaleFormControl.value < this.costFormControl.value) return false;
    }
    return this.codeFormControl.valid &&
    this.descriptionFormControl.valid &&
    this.costFormControl.valid &&
    this.profitFormControl.valid &&
    this.salePriceFormControl.valid &&
    this.wholesaleFormControl.valid &&
    this.salePriceFormControl.valid &&
    this.costFormControl.value < this.salePriceFormControl.value;
  }

  resetInputs(): void{
    this.productToUpdate = null;
    this.isCodeAvaliable = false;
    this.isUpdating = false;
    this.findedProducts = [];

    this.codeFormControl.setValue(null);
    this.descriptionFormControl.setValue(null);
    this.costFormControl.setValue(null);
    this.profitFormControl.setValue(null);
    this.salePriceFormControl.setValue(null);
    this.wholesaleFormControl.setValue(null);
    this.saleTypeFormControl.setValue('U');
  }

  calculatePrice(): void{
    const cost = parseFloat(this.costFormControl.value);
    const profit = parseFloat(this.profitFormControl.value);
    const salePrice = cost + (cost * profit) / 100;
    this.salePriceFormControl.setValue(salePrice);
  }

  //CREATE OR UPDATE Functions
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

  searchProductForUpdate(){
    if(this.inputUpdateValue){
      this.productsService.getProduct(this.inputUpdateValue).subscribe({
        next: (data) => this.findedProducts = data,
        error: () => {
          this.productToUpdate = null;
          Swal.fire({
            icon: "error",
            title: "Intente nuevamente",
            text: "No hay coincidencias con esa busqueda!",
          });
        },
        complete: () => this.processUpdateFindedProducts()
      });
    }
  }

  processUpdateFindedProducts(){
    if(this.findedProducts.length === 1){
      this.setUpdateControls(this.findedProducts[0]);
    }
    else{
      const modalRef = this.modal.open(SelectProductComponent,{
        width: '70%',
        height: '80%',
        data: { products: this.findedProducts}
      });

      modalRef.afterClosed().subscribe(product => {
        if(!product) this.productToUpdate = null;
        else{
          this.setUpdateControls(product);
        }
      });
    }
    this.inputUpdateValue = '';
  }

  setUpdateControls(product: any): void{
    this.productToUpdate = product;
    this.isCodeAvaliable = false;
    this.codeFormControl.setValue(product.code);
    this.descriptionFormControl.setValue(product.description);
    this.costFormControl.setValue(product.cost);
    this.profitFormControl.setValue(product.profitMargin);
    this.salePriceFormControl.setValue(product.salePrice);
    this.wholesaleFormControl.setValue(product.wholesalePrice);
    this.saleTypeFormControl.setValue(product.saleType);
  }

  saveProduct(): void{
    if(this.ispPoductDataValid()){
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

      if(this.isCodeAvaliable){
        this.productsService.createProduct(data).subscribe({
          next: (data) =>{
            console.log(data);

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Producto guardado exitosamente!",
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (err) => {
            console.error(err);

            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "Problemas al crear el producto nuevo!",
              showConfirmButton: false,
              timer: 1500
            });
          }
        })

        this.resetInputs();

      }else{
        Swal.fire({
          title: "¿Desea actualizar el producto?",
          html: `
            <p>Descripción: <b>${this.descriptionFormControl.value}</b></p><br>
            <p>Costos -> Anterior: $<b>${this.productToUpdate.cost}</b>  Nuevo: $<b>${this.costFormControl.value}</b></p><br>
            <p>Venta -> Anterior: $<b>${this.productToUpdate.salePrice}</b>  Nuevo: $<b>${this.salePriceFormControl.value}</b></p><br>
            <p>Mayoreo -> Anterior: $<b>${this.productToUpdate.wholesalePrice}</b>  Nuevo: $<b>${this.wholesaleFormControl.value}</b></p><br>
            <p>Ganancia -> Anterior: <b>${this.productToUpdate.profitMargin}%</b>  Nuevo: <b>${this.profitFormControl.value}%</b></p>
        `,        
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Actualizar!",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {

            this.productsService.updateProduct(data).subscribe({
              next: (data) =>{
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Producto actualizado exitosamente!",
                  showConfirmButton: false,
                  timer: 1500
                });
    
                this.resetInputs();

              },
              error: (err) =>{
                Swal.fire({
                  position: "top-end",
                  icon: "warning",
                  title: "Problemas al actualizar el producto!",
                  showConfirmButton: false,
                  timer: 1500
                });
              }
            })
          }
        });
      }
  
      console.log(data)
    }else{
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Datos invalidos!",
        text:'Por favor, introduzca los datos del producto nuevamente',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  //DELETE Functions
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

  deleteProduct(): void{
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      html: `
        <p>Descripción: <b>${this.productToDelete.description}</b></p><br>
        <p>Costo: $<b>${this.productToDelete.cost}</b></p><br>
        <p>Precio de venta: $<b>${this.productToDelete.salePrice}</b></p><br>
        <p>Precio de mayoreo: $<b>${this.productToDelete.wholesalePrice}</b></p><br>
        <p>Ganancia: <b>${this.productToDelete.profitMargin}%</b></p>
    `,        
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(this.productToDelete.code).subscribe({
          next: (data) => {
            console.log(data);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Producto eliminado exitosamente!",
              showConfirmButton: false,
              timer: 1500
            });
    
            this.productToDelete = null;
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "Problemas al eliminar el producto!",
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });


  }

  productWasNotFound(){
    this.productToDelete = null;
    Swal.fire({
      icon: "error",
      title: "Intente nuevamente",
      text: "No hay coincidencias con esa busqueda!",
    });
    this.deletePlaceholder = 'No hay coincidencias con ese producto!..';
  }


}

