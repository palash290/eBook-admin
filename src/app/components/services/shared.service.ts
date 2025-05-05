import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
      providedIn: 'root'
})
export class SharedService {
      baseUrl = environment.baseUrl

      constructor(private http: HttpClient, private route: Router) { }

      postAPI1(url: any, data: any): Observable<any> {
            const authToken = localStorage.getItem('eBookAdmin')
            const headers = new HttpHeaders({
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization: `Bearer ${authToken}`
            })
            return this.http.post(this.baseUrl + url, data, { headers: headers })
      }

      getApi(url: any): Observable<any> {
            const authToken = localStorage.getItem('eBookAdmin')
            const headers = new HttpHeaders({
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`
            })
            return this.http.get(this.baseUrl + url, { headers: headers })
      }

      get<T>(url: string): Observable<T> {
            return this.http.get<T>(this.baseUrl + url);
      };

      postAPI<T, U>(url: string, data: U): Observable<T> {
            const authToken = localStorage.getItem('eBookAdmin')
            const headers = new HttpHeaders({
                  Authorization: `Bearer ${authToken}`
            })
            return this.http.post<T>(this.baseUrl + url, data, { headers: headers })
      };
      update<T, U>(url: string, data: U): Observable<T> {
            const authToken = localStorage.getItem('eBookAdmin')
            const headers = new HttpHeaders({
                  Authorization: `Bearer ${authToken}`
            })
            return this.http.put<T>(this.baseUrl + url, data, { headers: headers })
      };

      delete<T>(url: string): Observable<T> {
            const authToken = localStorage.getItem('eBookAdmin')
            const headers = new HttpHeaders({
                  Authorization: `Bearer ${authToken}`
            })
            return this.http.delete<T>(this.baseUrl + url, { headers: headers });
      };

      setToken(token: string) {
            localStorage.setItem(`eBookAdmin`, token);
      }

      getToken() {
            return localStorage.getItem(`eBookAdmin`);
      }

      isLogedIn() {
            return !!this.getToken();
      }

      logout() {
            this.route.navigateByUrl('/')
            localStorage.clear()
            this.profileDataSubject.next(null);
      }

      private profileDataSubject = new BehaviorSubject<any>(null);
      profileData$ = this.profileDataSubject.asObservable();

      getProfile(url: string,) {
            if (this.isLogedIn()) {
                  const authToken = localStorage.getItem('eBookAdmin')
                  const headers = new HttpHeaders({
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                  })
                  this.http.get(this.baseUrl + url, { headers: headers }).subscribe((res: any) => {
                        this.profileDataSubject.next(res.profile);
                  });
            }
      }
}
