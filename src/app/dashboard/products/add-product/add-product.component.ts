import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastComponent } from 'src/app/toast/toast.component';
import { ProductBrowserComponent } from '../product-browser/product-browser.component';

import {MatChipsModule} from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/productsService/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatChipsModule, FormsModule]
  
})

export class AddProductComponent {
  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    private modal : MatDialog,
    private productService: ProductsService,
  ){
    this.productService.getDepartments().subscribe({
      next: (data) => this.departments = data
    })
  }

  actualInputId = 1;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.modal.openDialogs.length === 1){
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
   
  }
  codeRegex =  /[./]/;
  numberRegex = /^[0-9]+(\.[0-9]+)?/;

  code!: string;
  description!: string;
  saleType: string = 'U';

  cost: number = 0.00;
  profitMargin: number = 20;
  salePrice: number = 0.00;
  wholesalePrice: number = 0.00;

  priority:number = 0;
  inventory:number = 0;

  parentProduct!: any;
  department: number = 0;
  familyCode!: number;

  //Forms options based at DB
  childs!: any[];
  departments: any;

  cantity = 1.00;


  submitProduct(): void{
    const data = {
      code: this.code,
      description: 	this.description,
      saleType:	this.saleType,
      cost:	this.cost,
      salePrice: this.salePrice,
      department: this.department,
      wholesalePrice:	this.wholesalePrice,
      priority:	0,
      inventory: this.inventory,
      profitMargin: this.profitMargin,
      parentCode:	this.parentProduct ? this.parentProduct.code : null,
    }

    console.log(data);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto guardado!",
      showConfirmButton: false,
      timer: 1500
    });

  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }

  calculatePrice(): void{
    this.salePrice = this.cost + (this.cost * this.profitMargin) / 100;
  }

  validateCode() {
    return this.codeRegex.test(this.code);
  }

  validateNumber(numb : number){
    return this.numberRegex.test(numb.toString());
  }

  familyInfo(): void{
    this.modal.open(ToastComponent,{
      data: {
        title: '¿Qué son los productos padre?',
        text: 'Es una funcionalidad que te permite vincular varios productos a un mismo precio, lo que despues te ayudara a que solo tengas que modificar el precio de uno de esos productos para que se realicen los cambios en todos los productos vinculados al padre!'
      }
    });
  }

  //TOFIX 
  validatePrices(){
    if(!this.validateNumber(this.cost)) return false;
    if(!this.validateNumber(this.salePrice)) return false;
    if(!this.validateNumber(this.profitMargin)) return false;
    if(!this.validateNumber(this.wholesalePrice)) return false;
    if(this.salePrice < this.cost) return false;
    if(this.salePrice < this.wholesalePrice) return false;

    return true;
  }

  searchParentProduct(): void{
    const modalRef = this.modal.open(ProductBrowserComponent);

    modalRef.afterClosed().subscribe(product => {
      if(product){
        console.log(product)

        this.productService.getParentProd(product.code).subscribe({
          next: (data: any) => {
            this.parentProduct = data.parent;
            this.childs = data.childs
          },
          error: ()=> {
            this.parentProduct = product;
            this.childs = [];
          }
        })
      } 
    });
  }

}
