import { Component, HostListener } from '@angular/core';import { Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Snackbar } from '../snack-bars/snackbar.component';



@Component({
  selector: 'app-auth',
  template: `
  <div class="d-flex justify-content-center align-items-center vh-100" >
    <div class="pdv-card p-3" style="width: 500px; height: 500px;">
        <div style="display: flex; flex-direction: column; height: 100%;">
            <p>Sistema de ventas <b>ConnEr</b></p>
            <h1>Inicio de sesión</h1>
            <div style="flex: 1;">
                <div class="p-2">
                    <label style="font-size: larger;" class="my-1">Usuario</label>
                    <input type="text" id="1" [formControl]="user" name="code" class="styled-input" autocomplete="off" minlength="3" required>
                    <small *ngIf="user.invalid">Introduzca su nombre de usuario!</small>
                </div>
                <div class="p-2">
                    <label style="font-size: larger;" class="my-1">Contraseña</label>
                    <input type="password" id="2" [formControl]="password" name="code" class="styled-input" autocomplete="off" minlength="3" required>
                    <small *ngIf="password.invalid">Introduzca su contraseña!</small>
                </div>
            </div>
            <button [ngClass]="{'disabled-btn': user.invalid || password.invalid}" id="3" style="position: relative;" (click)="logging()" class="pdv-btn square-btn"><svg xmlns="http://www.w3.org/2000/svg"class="mx-2" viewBox="0 -960 960 960"><path d="M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Zm-272-42q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13ZM201-200h560v-282q-5 2-6.5 2H751q-27 0-47.5-9T663-518q-18 18-41 28t-49 10q-27 0-50.5-10T481-518q-17 18-39.5 28T393-480q-29 0-52.5-10T299-518q-21 21-41.5 29.5T211-480h-4.5q-2.5 0-5.5-2v282Zm560 0H201h560Z"/></svg>Iniciar sesión!</button>
        </div>
        <mat-progress-bar style="position: relative;" mode="indeterminate" class="my-2" *ngIf="loggingIsBlock"></mat-progress-bar>
    </div>
  </div>
`,
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, ReactiveFormsModule, MatSnackBarModule],
})
export class AuthComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ){}

  loggingIsBlock: boolean = false;
  user = new FormControl('');
  password = new FormControl('');
  actualInputId: number = 1;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 'Enter' && this.actualInputId != 4){
      this.actualInputId++;
      document.getElementById(this.actualInputId.toString())?.focus();
    }
  }

  logging() {
    if (this.loggingIsBlock) return;

    this.loggingIsBlock = true;

    const datos = {
      username: this.user.value,
      password: this.password.value
    }

    this.authService.login(datos).subscribe((res) =>{
      if(res === 'success'){
        this.router.navigate(['/dashboard']);
        this.infoBar('Bienvenido de vuelta!', 'success');
        this.loggingIsBlock = false;
      }else{
        this.infoBar('Revise bien sus credenciales!', 'error');
        this.loggingIsBlock = false;
      }
    });
  }
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  infoBar(message: string, className: 'success' | 'error' | 'info') {
    this._snackBar.openFromComponent(Snackbar, {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: { 
        message: message, 
        class: className 
      },
    });
  }

}
