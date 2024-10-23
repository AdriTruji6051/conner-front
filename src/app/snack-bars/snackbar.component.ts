import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="data.class">
      <span>{{ data.message }}</span>
    </div>

  `,
  styles: [`
    .success {
      background-color: #4caf50;
      color: white;
      padding: 16px;
    }
    .error {
      background-color: #f44336;
      color: white;
      padding: 16px;
    }
    .info {
      background-color: #2196f3;
      color: white;
      padding: 16px;
    }

    span{
      font-size: 15px;
    }
  `]
})
export class Snackbar{
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string, class: string }) {}
}
