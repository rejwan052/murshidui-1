import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Tag} from '../models/Tag';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {SongSelector} from '../models/SongSelector';
import {CountWrapper} from '../models/CountWrapper';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  private tagMap: Map<string, Tag> = new Map<string, Tag>();

  constructor(private http: HttpClient, private messagesService: MessagesService) {

  }


  retrieveAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(environment.javaHost + '/murshid-api/tags', {})
      .pipe(
        catchError((err) => {
          const message = `Could not retrieve the list of tags`;
          this.messagesService.showErrors(message);
          console.error(message, err);
          return throwError(err);
        })
      );
  }

  /**
   * This calls a single, specific http directly when the tag URL is called directly, or tries
   * to use the existing map of tags when the page had flowed from somewhere else
   */
  getTag(tagKey: string): Observable<Tag> {
    return this.http.get<Tag>(environment.javaHost + `/murshid-api/tags/${tagKey}`,
      {
        params: {
          key: tagKey
        }
      });
  }


  searchSelectors(tagKey: string, orderSongsBy: OrderSongsBy, pageSize: number, pageNumber: number): Observable<SongSelector[]> {
    return this.http.get<SongSelector[]>(environment.javaHost +  `/murshid-api/tags/${tagKey}/song-selectors`,
      {
        params : {
          order_by: orderSongsBy.toString(),
          page_size: pageSize.toString(),
          page_number: pageNumber.toString()
        }})
      .pipe(
        catchError(err => {
          console.error('error when calling /murshid-api/tags/$tagKey/song-selectors in TagsService.searchSelectors' + err);
          return  throwError(err);
        })
      );
  }


  songCountByTag(tagKey: string): Observable<number> {
    return this.http.get<CountWrapper>(environment.javaHost + `/murshid-api/tags/${tagKey}/song-selectors/count`,
      {})
      .pipe(
        map(countWrapper => countWrapper.count),
        catchError((err) => {
          console.error('error when calling /murshid-api/tags/$tagKey/song-selectors/count in TagsService,songCountByTag' + err);
          return of(0);
        })
      );
  }
}
