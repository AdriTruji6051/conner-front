import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
    <div *ngIf="!optionsEnabled">
      <h3>🤖 Pensando en terminos de IA... </h3>
      <mat-spinner></mat-spinner>
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

  predictProducts(){
    this.optionsEnabled = false;
  }
}
