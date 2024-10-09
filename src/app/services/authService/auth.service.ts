import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 
  }

  private apiURL = environment.apiUrl;

  get user(){
    const user = JSON.parse(sessionStorage.getItem('user')!)
    return user;
  }

  login(data: any): Observable<string> {
    return this.http
      .post<any>(this.apiURL + '/api/login', data, { observe: 'response' })
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
        map((res) => 'success'),
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

}