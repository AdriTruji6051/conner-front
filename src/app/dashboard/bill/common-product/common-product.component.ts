import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-product',
  templateUrl: './common-product.component.html',
  styleUrls: ['./common-product.component.css']
})
export class CommonProductComponent {

  constructor(
    public dialogRef: MatDialogRef<CommonProductComponent>,
  ){}

  actualInputId = 1;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter' && this.actualInputId != 4){
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }
  }

  description!: string;
  cantity = 1.00;
  salePrice = 0.00;

  submitProduct(): void{
    const prod = {
      code: `${Math.floor(Math.random() * 20)}-${this.description}`,
      description: this.description,
      saleType: 'U',
      cost: null,
      salePrice: this.salePrice,
      wholesalePrice: null,
      cantity: this.cantity,
      import: this.cantity * this.salePrice,
    }

    this.dialogRef.close(prod);
  }

  selectAllText(event: any): void{
    event.target.select();
    this.actualInputId = event.target.id;
  }
}
