import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {OrderSongsBy} from '../models/OrderSongsBy';

@Injectable({
  providedIn: 'root'
})
export class OrderByService {

  private sortByChange = new BehaviorSubject<OrderSongsBy>(OrderSongsBy.post);

  constructor() { }

  getObservable(): Observable<OrderSongsBy> {
    return this.sortByChange.asObservable();
  }

  public getOrder(): OrderSongsBy {
    return this.sortByChange.getValue();
  }


  public changeOrder(orderSongsBy: OrderSongsBy): void {
    this.sortByChange.next(orderSongsBy);
  }
}
