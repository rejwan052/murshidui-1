import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, of} from 'rxjs';
import {concatMap, finalize, tap} from 'rxjs/operators';


@Injectable()
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
  }

  loadingOn(): void {
    this.loadingSubject.next(true);

  }

  loadingOff(): void {
    this.loadingSubject.next(false);
  }

}
