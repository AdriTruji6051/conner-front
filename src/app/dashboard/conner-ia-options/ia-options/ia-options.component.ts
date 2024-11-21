import { CommonModule } from '@angular/common';
import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { IaDataScienceService } from 'src/app/services/ia-dataScience/ia-data-science.service';

@Component({
  selector: 'app-ia-options',
  template: `
  <div class="p-3">
    <div *ngIf="optionsEnabled">
      <h2>
        Hola!, soy Conner AI🤓 👋
      </h2>
      <h3>¿En que te puedo ayudar? 🤔</h3>
      <hr>
      <button class="pdv-btn square-btn outlined-btn" (click)="predictProducts()">Recomiendame productos que se llevan con esta cuenta!</button>
    </div>
    <div *ngIf="consequentProducts.length > 0">
      <h3>Tus clientes podrian estar interesados en los siguientes productos 🧾😉</h3>
      <p *ngFor="let prod of consequentProducts" style="font-weight: 700;"><b>{{prod.description}}</b></p>
    </div>
    <div *ngIf="consequentProducts.length < 1 && connerHasCalled">
      <h2>Woops... 🫨</h2>
      <h3>Parece que no hay ninguna coincidencia con tu venta actual 😔</h3>
    </div>
  </div>

  `,
  styles: [
  ],
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
})
export class IaOptionsComponent {
  optionsEnabled: boolean = true;
  consequentProducts: any[] = [];
  connerHasCalled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<IaOptionsComponent>,
    private iaService: IaDataScienceService,
    @Inject(MAT_DIALOG_DATA) public data : {ticket : any},){}

  predictProducts(){
    this.optionsEnabled = false;
    this.iaService.consequentProducts(this.data.ticket.products.getCodes()).subscribe({
      next: (data) => this.consequentProducts = data,
      complete: () => this.connerHasCalled = true
    })
  }
}
