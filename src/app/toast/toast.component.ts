import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    <div class="main-container p-3">
      <button class="modal-close" (click)="dialogRef.close()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
      <div style="margin-top: 32px;">
        <h1>{{title}}</h1>
        <p>{{text}}</p>
      </div>
    </div>
  `,
  styles: [`
      .main-container{
        min-width: 300px;
        min-height: 300px;
        max-width: 500px;
      }

      .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        cursor: pointer;
        background: none;
        border: none;
        color: #666;
      }

    `]
})
export class ToastComponent {

  constructor(
    @Inject (MAT_DIALOG_DATA) public data: {title: string, text: string},
    public dialogRef: MatDialogRef<ToastComponent>
  ){
    this.title = this.data.title;
    this.text = this.data.text;
  }

  title!: string;
  text!: string;
}
