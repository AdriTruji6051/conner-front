import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/productsService/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-update',
  template: `
  <div class="m-2">
    <h1>¿Quiere realizar los cambios?</h1>
    <div class="row m-2">
      <div class="col-lg-6 p-1">
        <h3>Datos anteriores:</h3>
        <p>Código: <b>{{productOld.code}}</b></p>
        <p>Descripción: <b>{{productOld.description}}</b></p>
        <p>Costo: <b>{{productOld.cost}}</b></p>
        <p>Venta: <b>{{productOld.salePrice}}</b></p>
        <p>Mayoreo: <b>{{productOld.wholesalePrice}}</b></p>
        <p>Inventario: <b>{{productOld.inventory}}</b></p>
      </div>
      <div class="col-lg-6 p-1">
        <h3>Datos nuevos:</h3>
        <p>Código: <b>{{productNew.code}}</b></p>
        <p>Descripción: <b>{{productNew.description}}</b></p>
        <p>Costo: <b>{{productNew.cost}}</b></p>
        <p>Venta: <b>{{productNew.salePrice}}</b></p>
        <p>Mayoreo: <b>{{productNew.wholesalePrice}}</b></p>
        <p>Inventario: <b>{{productNew.inventory}}</b></p>
      </div>
    </div>
    <div *ngIf="productSiblings.length > 0">
      <hr>
      <h2>Productos vinculados</h2>
      <small>Si quiere que alguno de los productos a continuación no se actualice con los nuevos datos, deseleccionelo de la lista!</small><br>
      <mat-chip-row *ngFor="let product of productSiblings" (removed)="removeProduct(product)" class="m-1">
        {{product.description}}
        <button matChipRemove aria-label="'Eliminar ' + product">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
        </button>
      </mat-chip-row>
    </div>
    <div class="button-panel">
            <button type="button" class="pdv-btn outlined-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
            <button 
              type="button"
              id="11" 
              class="pdv-btn square-btn" 
              (click)="updateProduct()"
              >Actualizar!</button>
        </div>

  </div>
  `,
  styles: [
  ],
  standalone: true,
  imports: [CommonModule, MatChipsModule, ReactiveFormsModule]
})
export class ConfirmUpdateComponent {
  productSiblings!: any[];
  productNew!: any;
  productOld!: any;

  constructor(
    @Inject (MAT_DIALOG_DATA) public data: {productNew: any, productOld: any,siblings: any[]},
    public dialogRef: MatDialogRef<ConfirmUpdateComponent>,
    public productService: ProductsService,
  ){
    this.productNew = data.productNew;
    this.productOld = data.productOld;
    this.productSiblings = data.siblings;
  }

  removeProduct(product: string) {
    const index = this.productSiblings.indexOf(product);
    if (index >= 0) {
      this.productSiblings.splice(index, 1);
      console.log(this.productSiblings);
    }
  }

  updateProduct():void{
    this.productService.updateProduct(this.productNew).subscribe({
      next:()=> {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Producto guardado!",
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: ()=>{
        Swal.fire({
          icon: "error",
          title: "Verifique su conexión",
          text: "No se pudo guardar el producto!",
        });
      }
    });
  }
}
