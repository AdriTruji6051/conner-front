import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../authService/auth.service';
import { environment } from 'src/app/environment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
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
    }else{
      console.error(err);
    }
  }

  ticketHeaders(): Observable<any>{
    return this.http.
    get(this.apiURL + '/configs/ticket/headers', {
      headers: this.headers
    }).pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }

  ticketFooters(): Observable<any>{
    return this.http.
    get(this.apiURL + '/configs/ticket/footers', {
      headers: this.headers
    }).pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }

}
