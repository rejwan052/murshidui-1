import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DictionaryView} from '../models/DictionaryView';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {CountWrapper} from '../models/CountWrapper';
import {SongSelector} from '../models/SongSelector';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient, private messagesService: MessagesService) { }

  searchWord(word: string): Observable<DictionaryView[]> {
    return this.http.get<DictionaryView[]>(environment.javaHost + '/murshid-api/dictionaries/entries',
      {
        params : {
          word
        }})
      .pipe(
        catchError((err) => {
          const message = `Error searching the word ${word} in the dictionary`;
          this.messagesService.showErrors(message);
          console.error(message, err);
          return throwError(err);
        })
      );
  }

  searchSelectors(word: string, orderSongsBy: OrderSongsBy, pageSize: number, pageNumber: number): Observable<SongSelector[]> {
    return this.http.get<SongSelector[]>(environment.javaHost + '/murshid-api/dictionaries/song-selectors',
      {
        params : {
          word,
          order_by: orderSongsBy.toString(),
          page_size: pageSize.toString(),
          page_number: pageNumber.toString()
        }})
      .pipe(
        catchError(err => {
          const message = 'error when calling /murshid-api/dictionaries/searchword in DictionaryService,searchWOrd\' + err)';
          console.error(message + err);
          return throwError(message, err);
        })
      );
  }

  songCountByWord(word: string): Observable<number> {
    return this.http.get<CountWrapper>(environment.javaHost + '/murshid-api/dictionaries/song-selectors/count',
      {
        params : {
          word
        }})
      .pipe(
        map(countWrapper => countWrapper.count),
        catchError((err) => {
          console.error('error when calling /murshid-api/dictionaries/song-count-by-word in DictionaryService,songCountByWord' + err);
          return of(0);
        })
      );
  }

}
