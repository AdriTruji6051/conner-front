import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TicketService } from 'src/app/services/ticketService/ticket-service';
import { columnsLong, columnsMedium, columnsSmall, columnLabel } from './table-columns';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModifyTicketComponent } from './modify-ticket/modify-ticket.component';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface ticket {
  ID: number,
  articleCount: number,
  createdAt: string,
  notes: string,
  profit: number,
  subTotal: number,
  total: number,
  products: any[],
}

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, FormsModule, MatDialogModule]
})
export class TicketsComponent implements AfterViewInit{
  displayedColumns!: any;
  columnLabel: any = columnLabel 
  dataSource = new MatTableDataSource<ticket>();
  ticketRow!: any;
  date!: any;
  selectedPrinter: number = 0;
  printers!: string[];

  constructor(
    private ticketService : TicketService,
    private modal : MatDialog,
  ){
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));

    this.date = new Date().toISOString().split('T')[0];
    
    this.ticketService.getTicketsByDay(this.date).subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error(err),
    })

    this.ticketService.getPrinters().subscribe({
      next: (data) => this.printers = data,
    })
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private onResize(){
    if(window.innerWidth >= 1200){
      this.displayedColumns = columnsLong;

    }else if(window.innerWidth <= 1200 && window.innerWidth >= 668){
      this.displayedColumns = columnsMedium;
    }
    else{
      this.displayedColumns = columnsSmall;
    }
  }

  selectTicket(row: any): void{
    this.ticketRow = row;
  }

  searchNewDates(): void{
    this.ticketService.getTicketsByDay(this.date).subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error(err),
    })
    this.ticketRow = null;
  }

  changePrinter(printerIndex: any): void{
    this.selectedPrinter = printerIndex;
  }

  reprintTicket(): void{
    if(this.ticketRow){
      const data = {
        id: this.ticketRow.ID,
        printerName: this.printers[this.selectedPrinter] ? this.printers[this.selectedPrinter] : null,
      }
      this.ticketService.printTicketById(data).subscribe({
        next: (answ) => 
          {
            console.log(answ);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Ticket reimpreso!",
              showConfirmButton: false,
              timer: 1500
            });
          },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Error de servidor",
            text: "El ticket no se pudo imprimir, verifique su conexión!",
          });
        },
      })
    }else{
      Swal.fire({
        icon: "warning",
        title: "No ha seleccionado ticket",
        text: "Aun no ha elegido un ticket, por favor, eliga uno!",
      });
    }
  }

  modifyTicket(): void{
    if(this.ticketRow){
      const modalRef = this.modal.open(ModifyTicketComponent,{
        width: '80%',
        height: '80%',
        data: { ticket: this.ticketRow}
      });
  
      modalRef.afterClosed().subscribe(product => {
        if(product) console.log('xd')
      });
    }
  }
}
