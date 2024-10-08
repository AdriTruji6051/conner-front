import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticketService/ticket-service';

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
  ticket!: any;

  constructor(
    public dialogRef: MatDialogRef<ModifyTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {ticket : any},
    private ticketService: TicketService,
  ){
    this.ticket = this.data.ticket;
    console.log(this.ticket)
  }

  submitNewTicket(): void{
    if(this.isValid()){
      let newTicket = [];
      for(let prod of this.ticket.products){
        if(prod.cantity > 0) newTicket.push(prod)
      }
      
      console.log(newTicket)
    }
  }

  isValid(): boolean{
    for(let prod of this.ticket.products) if(prod.cantity < 0) return false
    return true
  }

}
