import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  constructor(private authService : AuthService){ }
  
  test() {
    console.log(this.authService.user);
  }

  test2() {
    this.authService.getProduct('HUE').subscribe({
      next: (data) => console.log(data.response),
      error: (err) => console.log(err),
    });
  }

  test3(){
    this.authService.getProduct_TOFIX('mamwebo').subscribe({
      next: (data) => console.log(data.response),
      error: (err) => console.error(err)
    })
  }

  
}
