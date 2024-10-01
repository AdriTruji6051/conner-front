import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';
import { environment } from 'src/app/environment/environment';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private headers: HttpHeaders;
  private apiURL = environment.apiUrl;
  
  constructor(private authService : AuthService, private http: HttpClient) { 
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.user.token}`
    })
  }

  getProductNames(): Observable<any>{
    return this.http
    .get<any>(this.apiURL + '/api/get/all/products', {
      headers: this.headers
    })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error)
        return throwError(()=> error);
      })
    )
  }

  getProduct(data: any): Observable<any>{
    return this.http
    .get<any>(this.apiURL + '/api/get/product/' + data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        console.error(error);
        return throwError(()=> error);
      })
    )
  }

  getProductById(data: any): Observable<any>{
    return this.http
    .get<any>(this.apiURL + '/api/get/product/id/' + data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        console.error(error);
        return throwError(()=> error);
      })
    )
  }

  createProduct(data: any): Observable<any>{
    return this.http
    .post<any>(this.apiURL + '/api/create/product/', data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        console.error(error);
        return throwError(()=> error);
      })
    )
  }

  updateProduct(data: any): Observable<any>{
    return this.http
    .put<any>(this.apiURL + '/api/update/product/', data, {
      headers: this.headers
    })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      }) 
    )
  }

  deleteProduct(data: any): Observable<any>{
    return this.http
    .delete(`${this.apiURL + '/api/delete/product/id/' + data}`,{
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

}
