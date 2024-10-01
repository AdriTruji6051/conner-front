import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';
import { environment } from 'src/app/environment/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private headers: HttpHeaders;
  private apiURL = environment.apiUrl;
  
  constructor(private authService : AuthService, private http: HttpClient) { 
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.user.token}`
    })
  }

  createTicket(data: any): Observable<any>{
    return this.http
    .post<any>(this.apiURL + '/api/create/ticket/', data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        console.error(error);
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
        console.error(error);
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
        console.error(error);
        return throwError(()=> error);
      })
    )
  }
}
