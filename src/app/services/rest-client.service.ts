import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,  HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestClient {
    private httpOptions;
    constructor( @Inject(HttpClient) private http: HttpClient, private router: Router) {}

    getHeader(){
      var userData = JSON.parse(localStorage.getItem("user"));
      var user_login = {
        'user_id': userData != null || userData != undefined ? userData.external_id : "",
        'user_name': userData != null || userData != undefined ? userData.first_name : ""   
      };
      return this.httpOptions = {
        headers: new HttpHeaders({
          // 'Content-Type':  'application/json'
        })
      }
    }

    public appendHeaders(key: string, value: string) {
        this.httpOptions.headers.set(key, value);
        localStorage.setItem(key, value);
    }

    public removeHeaders(key: string) {
        this.httpOptions.headers.delete(key);
    }

    public get(url): Observable<any> {
        return this.http.get<any>(url);
    }

    public put(url, data: any):Observable<any> {
        return this.http.put(url, data, this.getHeader()).
        pipe(catchError(this.handleError));
    }

    public post(url, data: any) :Observable<any>{
        return this.http.post(url, data, this.getHeader()).
        pipe(catchError(this.handleError));
    }

    public delete(url) :Observable<any>{
        return this.http.delete(url, this.getHeader()).
        pipe(catchError(this.handleError));
    }

  private handleError(error: HttpErrorResponse) {
    
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned error :${error}`);

    // return an observable with a user-facing error message
    let errorMessage = error || "Something went wrong!!";
    if(Array.isArray(errorMessage)) {
      errorMessage = errorMessage[0];
    }

    return throwError(
      errorMessage);
  };
}
