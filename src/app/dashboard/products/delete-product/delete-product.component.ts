import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/productsService/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-product',
  template: `
    <div class="m-2 main-div">
      <div>
        <h3>Seleccione el producto a eliminar</h3>
        <p>Busqueda por nombre o código</p>
        <app-product-browser (productForParent)="loadProduct($event)"></app-product-browser>
      </div>
      <div *ngIf="product">
        <h3>Producto: <b>{{product.description}}</b></h3>
        <p>Código: <b>{{product.code}}</b></p>
        <p>Costo: <b>{{product.cost}}</b></p>
        <p>Ganancia: <b>{{product.profitMargin}}</b>%</p>
        <p>Precio de venta: <b>{{product.salePrice}}</b></p>
        <p>Precio de mayoreo: <b>{{product.wholesalePrice}}</b></p>
        <p>Inventario: <b>{{product.inventory}}</b></p>
      </div>
      <div class="button-panel">
        <button type="button" class="pdv-btn outlined-btn square-btn" (click)="dialogRef.close()">Cerrar</button>
        <button 
          type="button"
          id="11" 
          class="pdv-btn square-btn" 
          (click)="deleteProduct()"
          >Eliminar!</button>
      </div>
    </div>
  `,
  styles: [`
   .button-panel {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e5e5;
  }

  .main-div{
    min-height: 300px;
    overflow-y: auto;
  }
  `]
})
export class DeleteProductComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProductComponent>,
    public modal: MatDialog,
    public productsService: ProductsService,
  ){}
  product!: any;

  loadProduct(product :any): void{
    this.product = product;
  }

  deleteProduct(): void{
    Swal.fire({
      title: "¿Desea eliminar el producto de la base de datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(this.product.code).subscribe({
          next:()=> {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Producto eliminado correctamente!",
              showConfirmButton: false,
              timer: 1500
            });
            this.product = null;
          },
          error: ()=>{
            Swal.fire({
              icon: "error",
              title: "Verifique su conexión",
              text: "No se pudo eliminar el producto!",
            });
          }
        });
      }
    });
  }

}
