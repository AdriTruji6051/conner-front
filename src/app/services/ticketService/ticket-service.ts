import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';
import { environment } from 'src/app/environment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private headers: HttpHeaders;
  private apiURL = environment.apiUrl;
  
  constructor(
    private authService : AuthService, 
    private http: HttpClient,
    private router: Router,
  ) { 
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.user.token}`
    })
  }

  validateError(err: any){
    if(err.status === 401){
      Swal.fire('Error', 'La sesión ha caducado, favor de iniciar sesión nuevamente!', 'error');
      this.router.navigate(['/auth']);
    }else if(err.status === 500){
      Swal.fire('Error', 'La sesión ha caducado, favor de iniciar sesión nuevamente!', 'error');
      this.router.navigate(['/auth']);
    }else{
      console.error(err);
    }
  }

  createTicket(data: any): Observable<any>{
    return this.http
    .post<any>(this.apiURL + '/api/create/ticket/', data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }

  updateTicket(data: any): Observable<any>{
    return this.http
    .put<any>(this.apiURL + '/api/update/ticket/', data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }

  registerLocalPrinters(): Observable<any>{
    return this.http
    .get<any>(this.apiURL + '/api/init/new/', {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )

  }

  getPrinters(): Observable<any>{
    return this.http
    .get<any>(this.apiURL + '/api/get/printers/', {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }

  getTicketsByDay(day: string): Observable<any>{
    return this.http
    .get<any>(this.apiURL + '/api/get/tickets/day/' + day,{
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }

  printTicketById(data: any): Observable<any>{
    return this.http
    .post<any>(this.apiURL + '/api/print/ticket/id/', data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }
}
