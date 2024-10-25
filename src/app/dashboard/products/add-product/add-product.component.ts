import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastComponent } from 'src/app/toast/toast.component';
import { ProductBrowserComponent } from '../product-browser/product-browser.component';
import {MatChipsModule} from '@angular/material/chips';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/productsService/products.service';
import { debounceTime } from 'rxjs';
import { Snackbar } from 'src/app/snack-bars/snackbar.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatChipsModule, FormsModule, ProductBrowserComponent, MatSnackBarModule]
  
})

export class AddProductComponent {
  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    private modal : MatDialog,
    private productService: ProductsService,
    private _snackBar: MatSnackBar,
  ){
    this.productService.getDepartments().subscribe({
      next: (data) => this.departments = data
    })
  }

  ngOnInit() {
    this.code.valueChanges
    .pipe(debounceTime(400))  
    .subscribe((code) => {
      if(!this.validateCode()){
        this.productService.getProductById(code).subscribe({
          next: () => this.codeUnvaliable = true,
          error: () => this.codeUnvaliable = false
        });
      }
    });
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
      }else if(event.key === 'ArrowDown' && this.actualInputId != 3 || event.key === 'ArrowRight' && this.actualInputId != 4){
        event.preventDefault();
        this.actualInputId++;
        document.getElementById(this.actualInputId.toString())?.focus();
      }else if(event.key === 'ArrowUp' && this.actualInputId != 3 || event.key === 'ArrowLeft' && this.actualInputId != 1){
        event.preventDefault();
        this.actualInputId--;
        document.getElementById(this.actualInputId.toString())?.focus();
      }
    }
   
  }

  codeUnvaliable: boolean = false;
  codeRegex =  /[./]/;
  numberRegex = /^[0-9]+(\.[0-9]+)?/;

  code = new FormControl('');
  description!: string;
  saleType: string = 'U';

  cost: number = 0.00;
  profitMargin: number = 20;
  salePrice: number = 0.00;
  wholesalePrice: number = 0.00;

  inventory:number = 0;

  parentProduct!: any;
  department: number = 0;
  familyCode!: number | null;

  //Forms options based at DB
  childs!: any[];
  departments: any;

  //State
  showProductBrowser: boolean = false;

  submitProduct(): void{
    const data = {
      code: this.code.value,
      description: 	this.description,
      saleType:	this.saleType,
      cost:	this.cost,
      salePrice: this.salePrice,
      department: parseInt(this.department.toString()),
      wholesalePrice:	this.wholesalePrice,
      inventory: this.inventory,
      profitMargin: this.profitMargin,
      parentCode:	this.parentProduct ? this.parentProduct.code : null,
    }

    this.productService.createProduct(data).subscribe({
      next:()=> {
        this.infoBar('Producto guardado', 'success');
        this.resetValues()
      },
      error: ()=> this.infoBar('No se pudo guardar el producto', 'error')
    })
  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }

  resetValues(): void{
    this.codeUnvaliable = false;
    this.code.setValue('');
    this.description = '';
    this.saleType = 'U';
    this.cost = 0;
    this.profitMargin = 20;
    this.salePrice = 0;
    this.wholesalePrice = 0;
    this.inventory = 0;
    this.parentProduct  = null;
    this.department = 0;
    this.familyCode = null;
    this.childs = [];
  }

  calculatePrice(): void{
    this.salePrice = this.cost + (this.cost * this.profitMargin) / 100;
  }

  validateCode() {
    if(this.code.value){
      return this.codeRegex.test(this.code.value);
    }
    return false
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
    if(this.validateNumber(this.cost)) return false;
    if(this.validateNumber(this.salePrice)) return false;
    if(this.validateNumber(this.profitMargin)) return false;
    if(this.validateNumber(this.wholesalePrice)) return false;
    if(this.salePrice > this.cost) return false;
    if(this.salePrice > this.wholesalePrice) return false;

    return true;
  }

  searchParentProduct(product: any): void{
    if(product){
      this.cost = product.cost;
      this.salePrice = product.salePrice;
      this.profitMargin = product.profitMargin;
      this.wholesalePrice = product.wholesalePrice;
      this.department = product.department;
      this.saleType = product.saleType;
      
      this.productService.getParentProd(product.code).subscribe({
        next: (data: any) => {
          this.parentProduct = data.parent;
          this.childs = data.childs
        },
        error: ()=> {
          if(this.code !== product.code) this.parentProduct = product;
          this.childs = [];
        }
      })
    } 
    this.showProductBrowser = false;
  }

  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  infoBar(message: string, className: 'success' | 'error' | 'info') {
    this._snackBar.openFromComponent(Snackbar, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: { 
        message: message, 
        class: className 
      },
    });
  }
}
