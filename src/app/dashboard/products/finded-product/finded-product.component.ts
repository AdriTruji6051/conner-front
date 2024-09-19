import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/productsService/products.service';


@Component({
  selector: 'app-finded-product',
  templateUrl: './finded-product.component.html',
  styleUrls: ['./finded-product.component.css']
})

export class FindedProductComponent{
  

  constructor(
    public dialogRef: MatDialogRef<FindedProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: string },
    private prodServ : ProductsService
  ) {

  }

  cerrarModal(): void {
    this.dialogRef.close('Dato de retorno del modal');
  }
}
