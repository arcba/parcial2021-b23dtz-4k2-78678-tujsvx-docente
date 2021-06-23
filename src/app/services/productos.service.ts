import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = 'https://pymesbackend.azurewebsites.net/api/productos/';
  }

  get(): Observable<Producto[]> {
    return this.httpClient.get<Producto[]>(this.resourceUrl);
  }

  post(obj: Producto) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
}
