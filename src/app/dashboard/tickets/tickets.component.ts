import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { ProductsService } from 'src/app/services/productsService/products.service';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  constructor(
    private authService : AuthService,
    private ProductsService : ProductsService
  ){ }
  
  test() {
    console.log(this.authService.user);
  }

  test2() {
    const data = {
      "code": `PASTILLAJE`,
      "description": 'TESTPASTILLAJE',
      "saleType": 'U',
      "cost": 777,
      "salePrice": 777,
      "department": 2,
      "wholesalePrice": 777,
      "priority": 0,
      "inventory": 0,
      "profitMargin": 20
    }

    this.ProductsService.updateProduct(data).subscribe({
      next: (data) => console.log(data.message),
      error: (err) => console.log(err),
    });
  }
  
}
