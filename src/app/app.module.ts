import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './dashboard/navigation/navigation.component';
import { TicketsComponent } from './dashboard/tickets/tickets.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SelectProductComponent } from './dashboard/products/select-product/select-product.component';
import { CommonProductComponent } from './dashboard/bill/common-product/common-product.component';
import { GranelSaleComponent } from './dashboard/bill/granel-sale/granel-sale.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    TicketsComponent,
    CommonProductComponent,
    GranelSaleComponent,
  ],
  imports: [
    SelectProductComponent,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
