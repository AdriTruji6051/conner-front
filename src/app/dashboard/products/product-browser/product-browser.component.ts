import {CommonModule, CurrencyPipe} from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Component, EventEmitter, Output } from '@angular/core';
import { debounceTime, map, Observable, of, startWith } from 'rxjs';
import { ProductsService } from 'src/app/services/productsService/products.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectProductComponent } from '../select-product/select-product.component';
import { ToastComponent } from 'src/app/toast/toast.component';

@Component({
  selector: 'app-product-browser',
  templateUrl: './product-browser.component.html',
  styleUrls: ['./product-browser.component.css'],
  standalone: true,
  imports: [CurrencyPipe, CommonModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule],
})
export class ProductBrowserComponent {

  @Output() productForParent = new EventEmitter<any>();
  //Finded products
  inputSearch = new FormControl('');
  inputCode!: string;
  filteredProducts!: Observable<any[]>;
  products!: any;

    //Filter products events
    private _filterProducts(value: string = ''): any[] {
      const filterValue = value.toLowerCase();
      return this.products.filter((product: { description: string; }) => product.description.toLowerCase().includes(filterValue));
    }

  constructor(
    public productsService: ProductsService,
    public modal : MatDialog
  ){
    this.inputSearch.valueChanges.pipe(debounceTime(300)).subscribe({
      next: () =>{
        const search = this.inputSearch.value
        if(search){
          this.productsService.getProductNames(search).subscribe({
            next: (data) =>{
              this.products = data;
              this.filteredProducts = this.inputSearch.valueChanges.pipe(
                startWith(''),
                map(product => (product ? this._filterProducts(product) : this.products.slice())),
              );
            }
          })
        }
          
      },
    });
  }

  blurInput(): void{
    document.getElementById('search-input')?.blur();
  }

  resetInput(): void{
    this.inputSearch.setValue('');
    this.products = [];
  }

  quickSearch(prodCode: any): void{
    this.inputSearch.setValue(prodCode);
    this.searchProduct();
  }

  searchProduct(){
    var findedProducts: any;
    this.filteredProducts = of([]);
    if(this.inputSearch.value){
      this.inputCode = this.inputSearch.value;
      this.productsService.getProduct(this.inputSearch.value).subscribe({
        next: (data) => findedProducts = data,
        error: () => {
          //NEW MODAL ERROR
          this.modal.open(ToastComponent,{
            data : {
              title: 'Producto no encontrado!',
              text: 'Verifique que el producto esta bien escrito.'
            }
          })
        },
        complete: () => this.processFindedProduct(findedProducts)
      });
    }

    this.blurInput();
  }

  processFindedProduct(findedProducts: any){
      if(findedProducts.length === 1 && findedProducts[0].code){
        if(findedProducts[0].code === this.inputCode) this.returnProduct(findedProducts[0]);
        else this.openFindedModal(findedProducts);
      }else{
        this.openFindedModal(findedProducts);
      }
      this.blurInput();
    }
  
    //MODALS
  openFindedModal(products: any): void{
    const modalRef = this.modal.open(SelectProductComponent,{
      width: '70%',
      height: '80%',
      data: { products: products}
    });

    modalRef.afterClosed().subscribe(product => {
      if(product) this.returnProduct(product);
    });
  }

  returnProduct(product: any): void{
    this.productForParent.emit(product);
  }

}
