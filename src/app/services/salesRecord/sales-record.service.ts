import { Injectable } from '@angular/core';
import { saleProducts } from './sales-record';

@Injectable({
  providedIn: 'root'
})
export class SalesRecordService {
  private salesRecord!: any;

  constructor() {
    this.salesRecord = [
      {
        ticketName: 'Ticket',
        total: 0.00,
        products: new saleProducts()
      }
    ]
  }

  getSaleByIndex(index: number = 0): any{
    return this.salesRecord[index];
  }

  getAllSales(): any[]{
    return this.salesRecord;
  }

  countSales(): number{
    return this.salesRecord.length;
  }

  resetSale(index: number): void{
    const name = this.salesRecord[index].ticketName;
    this.salesRecord[index] = {
      ticketName: name,
      total: 0.00,
      products: new saleProducts()
    };
  }

  addSale(name: string): void{
    this.salesRecord.push(
      {
        ticketName: name,
        total: 0.00,
        products: new saleProducts(),
      }
    )
  }

  private userName!: string;


  setUser(name: string){
    this.userName = name;
  }

  getUser(): string{
    return this.userName;
  }
}
