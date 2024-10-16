import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';
import { environment } from 'src/app/environment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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

  getProductNames(description: string): Observable<any>{
    return this.http
    .get<any>(this.apiURL + `/api/get/products/description/${encodeURIComponent(description)}`, {
      headers: this.headers,
    })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error)
        return throwError(()=> error);
      })
    )
  }

  getProduct(description: any): Observable<any>{
    return this.http
    .get<any>(this.apiURL + `/api/get/product/${encodeURIComponent(description)}`, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
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
        this.validateError(error);
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
        this.validateError(error);
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
        this.validateError(error);
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
        this.validateError(error);
        return throwError(() => error);
      })
    );
  }

  getParentProd(code : any){
    return this.http
    .get(this.apiURL + '/api/get/siblings/product/id/' + code,{
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(() => error);
      })
    )
  }

  getDepartments(){
    return this.http
    .get(this.apiURL + '/api/get/all/departments/',{
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        this.validateError(error);
        return throwError(() => error);
      })
    )
  }

 

}
