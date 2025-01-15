import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { AuthService } from '../authService/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

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


  day_statistics(date: string): Observable<any>{
    return this.http.get(
      this.apiURL + `/statistics/tickets/day/${encodeURI(date)}`, {
        headers: this.headers
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }

  range_statistics(start_date: string, end_date: string): Observable<any>{
    return this.http.get(
      this.apiURL + `/statistics/tickets/range/${encodeURI(start_date)}/${encodeURI(end_date)}`, {
        headers: this.headers
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.validateError(error);
        return throwError(()=> error);
      })
    )
  }
}
