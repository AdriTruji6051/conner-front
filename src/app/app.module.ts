import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './dashboard/navigation/navigation.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SelectProductComponent } from './dashboard/products/select-product/select-product.component';
import { CommonProductComponent } from './dashboard/bill/common-product/common-product.component';
import { GranelSaleComponent } from './dashboard/bill/granel-sale/granel-sale.component';
import { SubmitBillComponent } from './dashboard/bill/submit-bill/submit-bill.component';
import { NewTicketComponent } from './dashboard/bill/new-ticket/new-ticket.component';
import { ModifyTicketComponent } from './dashboard/tickets/modify-ticket/modify-ticket.component';
import { ModifyPriceComponent } from './dashboard/bill/modify-price/modify-price.component';
import { DeleteProductComponent } from './dashboard/products/delete-product/delete-product.component';
import { ProductsLabelComponent } from './dashboard/products/products-label/products-label.component';
import { ToastComponent } from './toast/toast.component';
import { ProductBrowserComponent } from "./dashboard/products/product-browser/product-browser.component";


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    CommonProductComponent,
    GranelSaleComponent,
    SubmitBillComponent,
    NewTicketComponent,
    ModifyTicketComponent,
    ModifyPriceComponent,
    DeleteProductComponent,
    ProductsLabelComponent,
    ToastComponent,
  ],
  imports: [
    SelectProductComponent,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ProductBrowserComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
