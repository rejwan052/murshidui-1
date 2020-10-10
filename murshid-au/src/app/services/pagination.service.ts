import { Injectable } from '@angular/core';


import {BehaviorSubject, Observable} from 'rxjs';
import {GlobalsService} from './globals.service';
import {Pagination} from '../models/Pagination';
import {PaginationUtils} from '../utils/PaginationUtils';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private paginationChange = new BehaviorSubject<Pagination>(new Pagination());


  getObservable(): Observable<Pagination> {
    return this.paginationChange.asObservable();
  }

  constructor() {
  }

  public getPagination(): Pagination {
    return this.paginationChange.getValue();
  }


  public changePagination(pagination: Pagination): void {
    this.paginationChange.next(pagination);
  }

}
