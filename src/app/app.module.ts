import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BillComponent } from './dashboard/bill/bill.component';
import { NavigationComponent } from './dashboard/navigation/navigation.component';
import { TicketsComponent } from './dashboard/tickets/tickets.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SelectProductComponent } from './dashboard/products/select-product/select-product.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BillComponent,
    NavigationComponent,
    TicketsComponent,
  ],
  imports: [
    SelectProductComponent,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
