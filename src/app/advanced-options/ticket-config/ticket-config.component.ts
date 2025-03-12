import { Component } from '@angular/core';
import { ConfigsService } from 'src/app/services/configs/configs.service';

@Component({
  selector: 'app-ticket-config',
  templateUrl: './ticket-config.component.html',
  styleUrls: ['./ticket-config.component.css']
})
export class TicketConfigComponent {
    //myArray: string[] = ["Dulceria MYA", "Servicio a domicilio", "Telefono: 3326449674"];
    headers!: any[];

    footers!: any[];

  constructor(private configService: ConfigsService){
    this.configService.ticketHeaders().subscribe({
      next: (data) => this.headers = data,
      error: (error) => console.error(error),
    })

    this.configService.ticketFooters().subscribe({
      next: (data) => this.footers = data,
      error: (error) => console.error(error),
    })
  }


  addHeader(){
    let header = {
      text: "...",
      font: this.headers.length -1 > 0 ? this.headers[this.headers.length -1].font : "font",
    }
    this.headers.push(header);
  }

  removeHeader(index: number){
    this.headers.splice(index, 1);
  }

  addFooter(){
    let footer = {
      text: "...",
      font: this.footers.length -1 > 0 ? this.footers[this.footers.length -1].font : "font",
    }
    this.footers.push(footer);
  }

  removeFooter(index: number){
    this.footers.splice(index, 1);
  }

  swapElements(array: any[], index1: number, index2: number): void {
    if (index1 < 0 || index2 < 0 || index1 >= array.length || index2 >= array.length) {
      console.log('Invalid indices');
      return;
    }
    
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }
  

}
