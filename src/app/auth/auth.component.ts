import { Component } from '@angular/core';import { Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
})
export class AuthComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ){ }

  openPDV() {
    const datos = {
      username: 'admin',
      password: 'admin'
    }

    this.authService.login(datos).subscribe((res) =>{
      console.log(res)
      if(res === 'success'){
        console.log(this.authService.user);
        this.router.navigate(['/dashboard']);
      }else{
        alert('No permitido');
      }
    });
  }

  test() {
    this.authService.isLoggedIn();  
  }

}
