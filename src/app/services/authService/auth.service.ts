import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.user.token}`
    })
  }

  private apiURL = environment.apiUrl;

  get user(){
    const user = JSON.parse(sessionStorage.getItem('user')!)
    return user;
  }

  login(data: any): Observable<string> {
    return this.http
      .post<any>(this.apiURL + '/login', data, { observe: 'response' })
      .pipe(
        tap((res) => {
          if (res.body && res.body.token) {
            const user = {
              user: data.username,
              token: res.body.token,
            };
            sessionStorage.setItem('user', JSON.stringify(user));
          }
        }),
        map((res) => 'success'), // Si llega aquí, el inicio de sesión fue exitoso.
        catchError((error: any) => {
          if (error instanceof HttpResponse && error.status === 401) {
            return of('error');
          }
          return of(error.error.msg);
        })
      );
  }

  isLoggedIn(): boolean{
    if (sessionStorage.getItem('user')) return true
    else return false;
  }



  getProduct_TOFIX(data: any): Observable<any>{
    return this.http.
    get<any>(this.apiURL + '/get/product/' + data, {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        console.log(error)
        return throwError(()=> error)
      })
    )
  }

  getProduct(data: any): Observable<any>{
    return this.http.
    get<any>(this.apiURL + '/protegido', {
      headers: this.headers
    })
    .pipe(
      catchError((error : HttpErrorResponse) => {
        console.log(error)
        return throwError(()=> error)
      })
    )
  }

}