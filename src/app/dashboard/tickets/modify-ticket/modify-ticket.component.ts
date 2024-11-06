import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticketService/ticket-service';
import { roundNumber } from 'src/app/utils/number-tratment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-ticket',
  template: `
    <div class="p-3 main-body">
      <h4>{{ticket.createdAt}}</h4>
      <h4 *ngIf="ticket.notes">Notas: {{ticket.notes}}</h4>

      <hr>
      <div class="table-container p-2">
        <section>
        <h3>¿Necesitas agregar productos al ticket?</h3>
          <app-product-browser (productForParent)="addNewProduct($event)"></app-product-browser>
          <div *ngFor="let prod of newProducts" class="row my-2 p-1" style="background-color: var(--100-color); border-radius: 9px">
            <div class="col-8 fs-5" style="margin-top: 10px;"><b>{{prod.description}}</b></div>
              <div class="col-4">
                <input type="number" class="styled-input" [(ngModel)]="prod.cantity">
              <div>
                <small *ngIf="prod.cantity < 0">Ingrese una cantidad valida!.</small>
              </div>       
            </div>
          </div>
        </section>
        <hr>
        <section>
          <div class="row" *ngFor="let prod of ticket.products">
                <div class="col-8"><b>{{prod.description}}</b></div>
                  <div class="col-4">
                    <input type="number" class="styled-input" [(ngModel)]="prod.cantity">
                  <div>
                    <small *ngIf="prod.cantity < 0">Ingrese una cantidad valida!.</small>
                  </div>       
                </div>
                <hr class="my-3">
          </div>
        </section>
      </div>
      <button type="button" id="3" class="pdv-btn square-btn" (click)="updateTicket()">Actualizar ticket</button>
    
    </div>
  `,
  styles: [`
    .main-body {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    .table-container{
      flex: 1;
    }
    
  `]
})
export class ModifyTicketComponent {
  ticket: any = [];
  ticketOriginal!: any;
  newProducts: any = [];

  constructor(
    public dialogRef: MatDialogRef<ModifyTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {ticket : any},
    private ticketService: TicketService,
  ){

    this.ticketOriginal = this.data.ticket;
    
    this.ticket = JSON.parse(JSON.stringify(this.ticketOriginal));
  }

  addNewProduct(product: any){
    this.newProducts.push({
      cantity: 1,
      code: product.code,
      cost: product.cost,
      description: product.description,
      import: roundNumber(product.salePrice),
      salePrice: roundNumber(product.salePrice),
      wholesalePrice: roundNumber(product.wholesalePrice)
    })
  }

  updateTicket(): void{
    if(this.isValid()){

      this.ticket.discount = 0;
      this.ticket.profit = 0;
      this.ticket.subTotal = 0;
      this.ticket.articleCount = 0;

      let newCantities = [];

      for(let i = 0; i < this.ticket.products.length; i++){

        if(this.ticket.products[i].cantity > 0){
          const product = this.ticket.products[i];

          if(product.isWholesale > 0) this.ticket.discount += product.isWholesale * product.cantity;
          if(product.profit > 0) product.isWholesale = ( (product.profit / 100) * product.usedPrice ) * product.cantity;
          if(product.profit > 0) this.ticket.profit += product.isWholesale;
          this.ticket.subTotal += product.usedPrice * product.cantity;
          this.ticket.articleCount += Math.ceil(product.cantity * 100) /100;

          newCantities.push(product);
        } 
      }

      this.ticket.subTotal += this.newProducts.reduce((acc: number, prod: { cantity: number; salePrice: number; }) => acc + prod.cantity * prod.salePrice, 0);

      this.ticket.profit = Math.ceil(this.ticket.profit * 100) / 100;
      this.ticket.discount = this.ticket.discount;
      this.ticket.subTotal = roundNumber(this.ticket.subTotal);
      this.ticket.total = roundNumber(this.ticket.total - this.ticket.subTotal < 0 ? this.ticket.subTotal: this.ticket.total);
      this.ticket.articleCount = this.ticket.articleCount;
      this.ticket.products = newCantities;
      this.ticket.newProducts = this.newProducts;
      this.ticket.ID = this.ticketOriginal.ID;

      console.log(this.ticket);
      this.ticketService.updateTicket(this.ticket).subscribe({
        next:() => 
          Swal.fire({ position: "top-end", icon: "success", title: "Ticket actualizado exitosamente!", showConfirmButton: false, timer: 1500 }),
        error: () => {
          Swal.fire('Error', 'El ticket no se pudo guardar correctamente!', 'warning');
        }
      })

      this.dialogRef.close(true);
    }
  }

  isValid(): boolean{
    for(let prod of this.ticket.products) if(prod.cantity < 0) return false
    return true
  }

}
