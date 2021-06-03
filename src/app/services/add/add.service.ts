import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AddService {

  constructor(private http: HttpClient) { }

  addReq(number1: number, number2: number): Observable<object> {
    console.log('add service addReq()');
    console.log(number1);
    console.log(number2);
    return this.http.post(environment.backendEndpoint + '/add', {
      number1: number1,
      number2: number2,
    });
  }
}
