import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticketService/ticket-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-ticket',
  template: `
    <div class="m-3">
      <h4>{{ticket.createdAt}}</h4>
      <h4>Notas {{ticket.notes}}</h4>

      <hr>
      <section>
        <div class="row" *ngFor="let prod of ticket.products">
              <div class="col-8">{{prod.description}}</div>
              <div class="col-4">
                <input type="number" [(ngModel)]="prod.cantity">
                <div>
                  <small *ngIf="prod.cantity < 0">Ingrese una cantidad valida!.</small>
                </div>       
              </div>
            </div>

        <button type="button" id="3" class="pdv-btn square-btn" (click)="submitNewTicket()">Actualizar ticket</button>
      </section>

    </div>
  `,
  styles: [
  ]
})
export class ModifyTicketComponent {
  ticket: any = [];
  ticketOriginal!: any;

  constructor(
    public dialogRef: MatDialogRef<ModifyTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {ticket : any},
    private ticketService: TicketService,
  ){

    this.ticketOriginal = this.data.ticket;
    
    this.ticket = JSON.parse(JSON.stringify(this.ticketOriginal));
  }

  submitNewTicket(): void{
    if(this.isValid()){

      this.ticket.discount = 0;
      this.ticket.profit = 0;
      this.ticket.subTotal = 0;
      this.ticket.articleCount = 0;

      let newProducts = [];

      for(let i = 0; i < this.ticket.products.length; i++){

        if(this.ticket.products[i].cantity > 0){
          const product = this.ticket.products[i];

          if(product.isWholesale > 0) this.ticket.discount += ( product.isWholesale / this.ticketOriginal.products[i].cantity ) * product.cantity;
          if(product.profit > 0) product.isWholesale = ( (product.profit / 100) * product.usedPrice ) * product.cantity;
          if(product.profit > 0) this.ticket.profit += product.isWholesale;
          this.ticket.subTotal += product.usedPrice * product.cantity;
          this.ticket.articleCount += Math.ceil(product.cantity * 100) /100;

          newProducts.push(product);
        } 
      }

      this.ticketOriginal.profit = Math.ceil(this.ticket.profit * 100) / 100;
      this.ticketOriginal.discount = this.ticket.discount;
      this.ticketOriginal.subTotal = this.ticket.subTotal;
      this.ticketOriginal.articleCount = this.ticket.articleCount;
      this.ticketOriginal.products = newProducts;

      this.ticketService.updateTicket(this.ticketOriginal).subscribe({
        next:() => 
          Swal.fire({ position: "top-end", icon: "success", title: "Ticket actualizado exitosamente!", showConfirmButton: false, timer: 1500 }),
        error: () => {
          Swal.fire('Error', 'El ticket no se pudo guardar correctamente!', 'warning');
        }
      })

      this.dialogRef.close();
    }
  }

  isValid(): boolean{
    for(let prod of this.ticket.products) if(prod.cantity < 0) return false
    return true
  }

}
