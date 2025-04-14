import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
      providedIn: 'root'
})
export class SharedService {
      baseUrl = environment.baseUrl

      constructor(private http: HttpClient) { }

      get<T>(url: string): Observable<T> {
            return this.http.get<T>(this.baseUrl + url);
      };

      postAPI<T, U>(url: string, data: U): Observable<T> {
            return this.http.post<T>(this.baseUrl + url, data)
      };
      update<T, U>(url: string, data: U): Observable<T> {
            return this.http.put<T>(this.baseUrl + url, data)
      };

      delete<T>(url: string): Observable<T> {
            return this.http.delete<T>(this.baseUrl + url);
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
            localStorage.clear()
            this.profileDataSubject.next(null);
      }

      private profileDataSubject = new BehaviorSubject<any>(null);
      profileData$ = this.profileDataSubject.asObservable();

}
