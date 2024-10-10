import { Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject} from 'rxjs';


import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';

import { btnTextDict } from './buttonsText';
import { saleProducts } from './sales-record';
import { ProductsService } from 'src/app/services/productsService/products.service';
import Swal from 'sweetalert2';
import { SelectProductComponent } from '../products/select-product/select-product.component';
import { FormsModule } from '@angular/forms';
import { CommonProductComponent } from './common-product/common-product.component';
import { GranelSaleComponent } from './granel-sale/granel-sale.component';
import { columnsLong, columnsMedium, columnsSmall, columnLabel } from './table-columns';
import { SubmitBillComponent } from './submit-bill/submit-bill.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { TicketService } from 'src/app/services/ticketService/ticket-service';
import { ModifyPriceComponent } from './modify-price/modify-price.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css'],
  standalone: true,
  imports: [MatTableModule, CurrencyPipe,MatDialogModule, CommonModule, FormsModule, MatMenuModule],
})

export class BillComponent{
  btnTextDict = btnTextDict;
  deleteProdBtnText! :string;
  commontArtBtnText! :string;
  wholesaleBtnText! :string;
  collectBtnText!: string;

  inputSearch = '';

  //Active ticket
  activeTicket!: any;
  total = 0.00;
  productsCount = 0;
  apliedDiscount = 0;
  salesRecord!: any;
  TicketIndex: number = 0;
  avaliablePrinters!: string[];

  //Previous ticket
  previousSubTotal!: number;
  previousProdCount!: number;
  previousTotal!: number;

  //Ticket table
  displayedColumns: string[] = columnsLong;
  displayedColumnsWithOptions: string[] = [...columnsLong, 'options'];
  
  columnLabel: any = columnLabel;

  //Products data
  dataSource = new MatTableDataSource<any>();
  productRow!: any;
  productRowIndex = 0;



  //Screen events
  private screenWidth = new BehaviorSubject<number>(window.innerWidth);
  screenWidth$ = this.screenWidth.asObservable();

  @ViewChildren('tableRow') tableRows!: QueryList<ElementRef>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9¡!¿?.,:;()@#$%^&*_~\[\]\{\} ]*$/;
    const key = event.key;    
    
    if(this.modal.openDialogs.length === 0){
      document.getElementById('search-input')?.focus()

      switch (true) {
        case key === 'ArrowDown':
          this.nextProduct();
          break;
          
        case key === 'ArrowUp':
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

        case key === 'F1':
          event.preventDefault();
          break;

        case key === 'F5':
          event.preventDefault();
          if(this.TicketIndex < this.salesRecord.length - 1){
            this.TicketIndex++;
            this.changeTicket(this.TicketIndex);
          }else{
            this.TicketIndex = 0;
            this.changeTicket(this.TicketIndex);
          }
          break;

        case key === 'F6':
          event.preventDefault();
          this.createNewTicket();
          break;

        case key === 'F10':
          event.preventDefault();
          break;
        
        case key === 'F11':
          event.preventDefault();
          this.wholesale();
          break;

        case key === 'F12':
          event.preventDefault();
          this.checkBill();
          break;
  
        case event.ctrlKey && key.toLowerCase() === 'p':
          event.preventDefault();
          this.newCommonProduct();
          break;
          
        case key.length === 1 && regex.test(key):
          event.preventDefault();
          this.inputSearch += key;
          break;
      }
    }
  }
 
  constructor(
    private productsService: ProductsService,
    private ticketService: TicketService,
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

    this.activeTicket = this.salesRecord[this.TicketIndex];

    this.ticketService.registerLocalPrinters().subscribe({
      next: () => {
        this.ticketService.getPrinters().subscribe({
          next: (data) =>{
            this.avaliablePrinters = data;
          }
        })
      },
      error: (err) => console.error(err)
    })
    
  }


  private onResize(){
    if(window.innerWidth > 1600){
      this.deleteProdBtnText = this.btnTextDict.delete.long;
      this.commontArtBtnText = this.btnTextDict.common.long;
      this.wholesaleBtnText = this.btnTextDict.wholesale.long;
      this.collectBtnText = this.btnTextDict.collect.long;
      this.displayedColumns = columnsLong;
      this.displayedColumnsWithOptions = [...columnsLong, 'options'];
    }
    else if(window.innerWidth <= 1600 && window.innerWidth > 1200){ 
      this.deleteProdBtnText = this.btnTextDict.delete.medium;
      this.commontArtBtnText = this.btnTextDict.common.medium;
      this.wholesaleBtnText = this.btnTextDict.wholesale.medium;
      this.collectBtnText = this.btnTextDict.collect.medium;
    }
    else if(window.innerWidth <= 1200 && window.innerWidth >= 668){
      this.deleteProdBtnText = this.btnTextDict.delete.medium;
      this.commontArtBtnText = this.btnTextDict.common.medium;
      this.wholesaleBtnText = this.btnTextDict.wholesale.medium;
      this.collectBtnText = this.btnTextDict.collect.medium;
      this.displayedColumnsWithOptions = [...columnsMedium, 'options'];
    }
    else{
      this.deleteProdBtnText = this.btnTextDict.delete.small;
      this.commontArtBtnText = this.btnTextDict.common.small;
      this.wholesaleBtnText = this.btnTextDict.wholesale.small;
      this.collectBtnText = this.btnTextDict.collect.small;
      this.displayedColumnsWithOptions = [...columnsSmall, 'options'];
    }
  }

  addProduct(product: any, cantity?: any): void{
    const appendedProduct = cantity ? this.activeTicket.products.add(product,cantity) : this.activeTicket.products.add(product);
    this.selectProduct(appendedProduct);
  }

  removeProduct(remove: number = 0): void{
    if(remove > 0){
      if(this.productRow.cantity - remove <= 0){
        this.activeTicket.products.remove(this.productRow, remove);
        if(this.productRowIndex === 0){
          this.productRowIndex--;
          this.nextProduct();
        } 
        else this.previousProduct();
        return
      }

      this.activeTicket.products.remove(this.productRow, remove);
      this.getProducts();
      
    }else{
      Swal.fire({
        title: "¿Desea eliminar el producto de la cuenta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancelar',
        confirmButtonText: "Eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.activeTicket.products.remove(this.productRow, remove);
          
          if(this.productRowIndex === 0){
            this.productRowIndex--;
            this.nextProduct();
          } 
          else this.previousProduct();
        }
      });
    }
  }

  wholesale(): void{
    if(this.activeTicket.products.wholesale) this.activeTicket.products.undoWholesale();
    else this.activeTicket.products.applyWholesale();
    this.getProducts();
  }

  getProducts(): any{
    const total = this.activeTicket.products.total();
    this.productsCount = this.activeTicket.products.count();
    this.total = total;
    this.apliedDiscount = this.activeTicket.products.discount;
    this.activeTicket.total = total;
    this.dataSource.data = this.activeTicket.products.get();
    return this.activeTicket.products.get();
  }

  searchProduct(){
    var findedProducts: any;
    if(this.inputSearch){
      this.productsService.getProduct(this.inputSearch).subscribe({
        next: (data) => findedProducts = data,
        error: () => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "No hay coincidencias con el producto!",
            showConfirmButton: false,
            timer: 900
          });
          this.inputSearch = '';
        },
        complete: () => this.processFindedProduct(findedProducts)
      });
    }
  }

  processFindedProduct(findedProducts: any){
      if(findedProducts.length === 1 && findedProducts[0].code){
        if(findedProducts[0].code === this.inputSearch) findedProducts[0].saleType != 'D' ? this.addProduct(findedProducts[0]): this.grannelProduct(findedProducts[0]);
        else this.openFindedModal(findedProducts);
      }else{
        this.openFindedModal(findedProducts);
      }

      this.inputSearch = '';
    }
  
    //MODALS
  openFindedModal(products: any): void{
    const modalRef = this.modal.open(SelectProductComponent,{
      width: '70%',
      height: '80%',
      data: { products: products}
    });

    modalRef.afterClosed().subscribe(product => {
      if(product) product.saleType != 'D' ? this.addProduct(product): this.grannelProduct(product);
    });
  }

  // Common product sale
  newCommonProduct(): void{
    const modalRef = this.modal.open(CommonProductComponent,{
      width: '500px',
      height: '360px',
    });

    modalRef.afterClosed().subscribe(product => {
      if(product) this.addProduct(product, product?.cantity);
    });
  }

  grannelProduct(product: any): void{
    const modalRef = this.modal.open(GranelSaleComponent,{
      width: '500px',
      height: '330px',
      data: {product: product}
    });

    modalRef.afterClosed().subscribe(product => {
      if(product) this.addProduct(product, product?.cantity);
    });
  }

  checkBill(): void{
    if(this.total){
      const productsRecord = this.getProducts();

      const modalRef = this.modal.open(SubmitBillComponent,{
        width: '578px',
        height: '500px',
        data: { 
          ticket: {
            total: this.total,
            products: productsRecord,
            wholesale: this.apliedDiscount,
            productsCount: this.productsCount,
          },
          printers: this.avaliablePrinters
        }
      });
  
      modalRef.afterClosed().subscribe(request => {
        if(request){
          this.previousSubTotal = this.activeTicket.products.total();
          this.previousProdCount = this.activeTicket.products.count();
          this.activeTicket = {
            ticketName: 'Ticket',
            total: 0.00,
            products: new saleProducts()
          }
          this.getProducts();

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Venta registrada!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }

  createNewTicket(): void{
    const modalRef = this.modal.open(NewTicketComponent,{
      width: '500px',
      height: '230px',
    });

    modalRef.afterClosed().subscribe(name => {
      if(name){
        this.salesRecord.push(
          {
            ticketName: name,
            total: 0.00,
            products: new saleProducts(),
          }
        )

        this.TicketIndex = this.salesRecord.length - 1;

        this.changeTicket(this.TicketIndex);
      };
    });
  }

  modifyProductPrice(product: any): void{
    const modalRef = this.modal.open(ModifyPriceComponent,{
      width: '500px',
      height: '350px',
      data: {
        product: product
      }
    });

    modalRef.afterClosed().subscribe(newProd => {
      this.activeTicket.products.update(newProd);
      this.getProducts();
    });
  }

  //Table events
  changeTicket(ticketId: any): void{
    if(ticketId!== 'CREATE-NEW-TICKET'){
      this.activeTicket = this.salesRecord[parseInt(ticketId)]
      const products = this.getProducts();
      this.productRow = products[products.length - 1];
      this.productRowIndex = products.length - 1;
    }else{
      this.createNewTicket();
    }
  }

  selectProduct(row: any) {
    const products = this.getProducts();
    this.productRowIndex = products.findIndex((obj: any) => row == obj);
    this.productRow = row;
    setTimeout(() => {
      this.scrollIntoView(`row${row.code}`);
    }, 250);
    
  }

  scrollIntoView(code: any): void{
    document.getElementById(code)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
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
