import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TicketService } from 'src/app/services/ticketService/ticket-service';
import { columnsLong, columnsMedium, columnsSmall, columnLabel } from './table-columns';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModifyTicketComponent } from './modify-ticket/modify-ticket.component';
import { btnTextDict } from './buttonsText';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Snackbar } from 'src/app/snack-bars/snackbar.component';


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
  imports: [CommonModule, MatTableModule, MatSortModule, FormsModule, MatDialogModule, MatSnackBarModule]
})
export class TicketsComponent implements AfterViewInit{
  displayedColumns!: any;
  columnLabel: any = columnLabel 
  btnTextDict = btnTextDict;
  dataSource = new MatTableDataSource<ticket>();
  ticketRow!: any;
  date!: any;
  selectedPrinter: number = 0;
  printers!: string[];

  //HTML layout
  reprintText!: string;
  editText!: string;

  constructor(
    private ticketService : TicketService,
    private modal : MatDialog,
    private _snackBar: MatSnackBar,
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
      this.editText = btnTextDict.edit.long;
      this.reprintText = btnTextDict.reprint.long;

    }else if(window.innerWidth <= 1200 && window.innerWidth >= 668){
      this.displayedColumns = columnsMedium;
      this.editText = btnTextDict.edit.medium;
      this.reprintText = btnTextDict.reprint.medium;
    }
    else{
      this.displayedColumns = columnsSmall;
      this.editText = btnTextDict.edit.small;
      this.reprintText = btnTextDict.reprint.small;
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
        next: () => this.infoBar('Ticket impreso correctamente!', 'success'),
        error: () => this.infoBar('El ticket no pudo ser impreso!', 'error'),
      })
    }else{
      this.infoBar('Aun no ha elegido un ticket, por favor, eliga uno!', 'info');
    }
  }

  modifyTicket(): void{
    if(this.ticketRow){
      this.modal.open(ModifyTicketComponent,{
        width: '80%',
        height: '80%',
        data: { ticket: this.ticketRow}
      });

    }
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
