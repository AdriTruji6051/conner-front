import { Component } from '@angular/core';
import { BehaviorSubject, count } from 'rxjs';


import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 

import { btnTextDict } from './buttonsText';
import { saleTicket } from './sales-record';
import { ProductsService } from 'src/app/services/productsService/products.service';
import Swal from 'sweetalert2';
import { SelectProductComponent } from '../products/select-product/select-product.component';
import { FormsModule } from '@angular/forms';

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

  salesRecord!: any;
  selectedTicked!: number;

  displayedColumns = ['code', 'description', 'salePrice', 'wholeSalePrice', 'cantity', 'import']
  dataSource = new MatTableDataSource<any>();

  total = 0.00;

  private screenWidth = new BehaviorSubject<number>(window.innerWidth);
  screenWidth$ = this.screenWidth.asObservable();
 
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
        ticket: new saleTicket()
      }
    ]

    this.selectedTicked = 0;
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
    const actualSale = this.salesRecord[this.selectedTicked];
    this.dataSource.data = actualSale.ticket.addProduct(product);
  }

  getProducts(): void{
    const actualSale = this.salesRecord[this.selectedTicked];
    this.dataSource.data = actualSale.ticket.getAllProducts();
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
        },
        complete: () => this.processFindedProduct(findedProducts)
      });

      this.inputSearch = '';
    }
  }

  processFindedProduct(findedProducts: any){
      if(findedProducts.length === 1){
        this.addProduct(findedProducts[0]);
      }else{
        const modalRef = this.modal.open(SelectProductComponent,{
          width: '70%',
          height: '80%',
          data: { products: findedProducts}
        });

        modalRef.afterClosed().subscribe(product => {
          if(product) this.addProduct(product);
        });
      }
    }
  
}
