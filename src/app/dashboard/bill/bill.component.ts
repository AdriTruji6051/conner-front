import { Component, HostListener } from '@angular/core';
import { BehaviorSubject, count } from 'rxjs';


import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 

import { btnTextDict } from './buttonsText';
import { saleProducts } from './sales-record';
import { ProductsService } from 'src/app/services/productsService/products.service';
import Swal from 'sweetalert2';
import { SelectProductComponent } from '../products/select-product/select-product.component';
import { FormsModule } from '@angular/forms';
import { CommonProductComponent } from './common-product/common-product.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css'],
  standalone: true,
  imports: [MatTableModule, CurrencyPipe,MatDialogModule, CommonModule, FormsModule],
})

export class BillComponent {
  btnTextDict = btnTextDict;
  deleteProdBtnText! :string;
  commontArtBtnText! :string;
  wholesaleBtnText! :string;
  collectBtnText!: string;

  inputSearch = '';

  //Active ticket
  activeTicket!: any;
  total = 0.00;
  salesRecord!: any;

  //Ticket table
  displayedColumns = ['code', 'description', 'salePrice', 'wholeSalePrice', 'cantity', 'import']
  dataSource = new MatTableDataSource<any>();
  productRow!: any;
  productRowIndex = 0;



  //Screen events
  private screenWidth = new BehaviorSubject<number>(window.innerWidth);
  screenWidth$ = this.screenWidth.asObservable();
  isModalOpen = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9¡!¿?.,:;()@#$%^&*_~\[\]\{\} ]*$/;
    document.getElementById('search-input')?.focus()
    const key = event.key;    
    console.log(key)

    switch (true) {
      case this.isModalOpen:
        event.preventDefault();
        break;
        
      case key === 'ArrowDown' && !this.isModalOpen:
        this.nextProduct();
        break;
        
      case key === 'ArrowUp' && !this.isModalOpen:
        this.previousProduct();
        break;
      
      case key === '+':
        event.preventDefault()
        if(this.productRow) this.addProduct(this.productRow);
        break;
      
      case key === '-':
        event.preventDefault()
        if(this.productRow) this.removeProduct(1);
        break;

      case key === 'Delete':
        this.removeProduct();
        break;
      
      case key === 'F11':
        event.preventDefault();
        this.wholesale();
        break;
        
      case key.length === 1 && regex.test(key):
        event.preventDefault();
        this.inputSearch += key;
        break;

    }
    
  }
 
  constructor(
    private productsService: ProductsService,
    private modal : MatDialog,
  ) {
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));

    this.salesRecord = [
      {
        ticketName: 'Ticket',
        total: 0.00,
        products: new saleProducts()
      }
    ]

    this.activeTicket = this.salesRecord[0];
  }

  private onResize(){
    if(window.innerWidth >= 1200){
      this.deleteProdBtnText = this.btnTextDict.delete.long;
      this.commontArtBtnText = this.btnTextDict.common.long;
      this.wholesaleBtnText = this.btnTextDict.wholesale.long;
      this.collectBtnText = this.btnTextDict.collect.long;
    }else{
      this.deleteProdBtnText = this.btnTextDict.delete.short;
      this.commontArtBtnText = this.btnTextDict.common.short;
      this.wholesaleBtnText = this.btnTextDict.wholesale.short;
      this.collectBtnText = this.btnTextDict.collect.short;
    }
  }

  addProduct(product: any): void{
    const appendedProduct = this.activeTicket.products.add(product);
    this.dataSource.data = this.getProducts();

    this.selectProduct(appendedProduct);
  }

  removeProduct(remove: number = 0): void{
    this.activeTicket.products.remove(this.productRow, remove);
    this.dataSource.data = this.getProducts();
    
    if(this.productRowIndex === 0){
      this.productRowIndex--;
      this.nextProduct();
    } 
    else this.previousProduct();
  }

  wholesale(): void{
    if(this.activeTicket.products.wholesale) this.activeTicket.products.undoWholesale();
    else this.activeTicket.products.applyWholesale();

    this.dataSource.data = this.getProducts();
  }

  getProducts(): any{
    this.total = this.activeTicket.products.total();
    return this.activeTicket.products.get();
  }

  searchProduct(){
    var findedProducts: any;
    if(this.inputSearch){
      this.productsService.getProduct(this.inputSearch).subscribe({
        next: (data) => findedProducts = data,
        error: () => {
          Swal.fire({
            icon: "warning",
            title: "Intente nuevamente",
            text: "No hay coincidencias con esa busqueda!",
          });
          this.inputSearch = '';
        },
        complete: () => this.processFindedProduct(findedProducts)
      });
    }
  }

  processFindedProduct(findedProducts: any){
      if(findedProducts.length === 1 && findedProducts[0].code){
        if(findedProducts[0].code === this.inputSearch) this.addProduct(findedProducts[0]);
        else this.openFindedModal(findedProducts);
      }else{
        this.openFindedModal(findedProducts);
      }

      this.inputSearch = '';
    }

  openFindedModal(products: any): void{
    this.isModalOpen = true;
    const modalRef = this.modal.open(SelectProductComponent,{
      width: '70%',
      height: '80%',
      data: { products: products}
    });

    modalRef.afterClosed().subscribe(product => {
      this.isModalOpen = false;
      if(product) this.addProduct(product);
    });
  }

  // Common product sale
  newCommonProduct(): void{
    this.isModalOpen = true;
    const modalRef = this.modal.open(CommonProductComponent,{
      width: '70%',
      height: '80%',
    });

    modalRef.afterClosed().subscribe(product => {
      this.isModalOpen = false;
      if(product) this.addProduct(product);
    });
  }

  //Table events
  selectProduct(row: any) {
    const products = this.getProducts();
    this.productRowIndex = products.findIndex((obj: any) => row == obj);
    this.productRow = row;
  }

  nextProduct(): void{
    const products = this.getProducts();
    if(this.productRowIndex < products.length - 1) this.selectProduct(products[this.productRowIndex + 1]);
  }

  previousProduct(): void{
    const products = this.getProducts();
    if(this.productRowIndex > 0) this.selectProduct(products[this.productRowIndex - 1]);
  }
  
}
