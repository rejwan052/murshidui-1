import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UseNastaliqService {

  private userNastaliqSubject = new BehaviorSubject<boolean>(true);
  public useNastaliqChange = this.userNastaliqSubject.asObservable();

  setNastaliq(use: boolean): void {
    this.userNastaliqSubject.next(use);
  }

}
