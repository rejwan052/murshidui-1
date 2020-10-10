import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SelectorItem} from '../models/SelectorItem';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {SelectorItemType} from '../models/SelectorItemType';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class SelectorsService {

  constructor(private http: HttpClient, private messagesService: MessagesService) {}

  retrieveSelectors(selectorItemType: SelectorItemType, substring: string, ): Observable<SelectorItem[]> {
    return this.http.get<SelectorItem[]>(environment.javaHost + `/murshid-api/selector/${selectorItemType}/${substring}`,  {})
      .pipe(
        catchError((err) => {
          const message = `Could not connect to the songs' database`;
          this.messagesService.showErrors(message);
          console.error(message, err);
          return throwError(err);
        })
      );
  }

}
