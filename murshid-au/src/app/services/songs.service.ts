import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SongModel} from '../models/SongModel';
import {InflectedKey} from '../models/InflectedKey';
import {MasterDictionaryKey} from '../models/MasterDictionaryKey';
import {Transliteration} from '../models/Transliteration';
import {InflectedLine} from '../models/InflectedLine';
import {MasterLine} from '../models/MasterLine';
import {SongSelector} from '../models/SongSelector';
import {MeaningRequestView} from '../models/MeaningRequestView';
import {MeaningResponseView} from '../models/MeaningResponseView';
import {environment} from '../../environments/environment';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {GlobalsService} from './globals.service';
import {MeaningScreen} from '../models/MeaningScreen';
import {catchError, map} from 'rxjs/operators';
import {CountWrapper} from '../models/CountWrapper';
import {MessagesService} from './messages.service';


@Injectable()
export class SongsService {

  // item-related
  public itemHoverChange = new BehaviorSubject<string>('');
  public itemHoverChangeObservable = this.itemHoverChange.asObservable();

  constructor(private http: HttpClient, private globals: GlobalsService, private messagesService: MessagesService) {
    this.itemHoverChangeObservable.subscribe(message => {

      if (!message) {
        return;
      }

      if (this.inflectedGeo == null) {
        return;
      }

      this.meaningScreen = new MeaningScreen();

      const meaningRequestView = new MeaningRequestView();
      const inflectedGeo = this.inflectedGeo.get(Number(message));
      const notInflectedGeo = this.notInflectedGeo.get(Number(message));
      let found = false;
      if (inflectedGeo) {
        meaningRequestView.inflected_key = inflectedGeo;
        found = true;
      }
      if (notInflectedGeo) {
        meaningRequestView.direct_master_references = notInflectedGeo;
        found = true;
      }
      if (!found) {
        console.error(' no neither master nor inflected found for ' + message);
        return;
      }


      meaningRequestView.transliteration = this.transliteration;

      this.retrieveMeanings(meaningRequestView).then(meaningResponse => {
        if (meaningResponse != null) {
          this.meaningScreen.inflected_word = meaningResponse.inflected_word;
          this.meaningScreen.canonical_word = meaningResponse.canonical_word;
          this.meaningScreen.accidence = meaningResponse.accidence;
          this.meaningScreen.part_of_speech = meaningResponse.part_of_speech;
          this.meaningScreen.show_canonical = !meaningResponse.hide_canonical;
          this.meaningScreen.meaning = meaningResponse.meaning;
          this.meaningScreen.phrases = new Map<string, string>();
          this.meaningScreen.useNastaliq = this.useNastaliq;

          Object.keys(meaningResponse.phrases).forEach(key => {
            this.meaningScreen.phrases.set(key, meaningResponse.phrases[key]);
          });
        }
      });
    });

  }


  public inflectedGeo = new Map<number, InflectedKey>();
  public notInflectedGeo = new  Map<number, MasterDictionaryKey[]>();
  public useNastaliq = true;
  public meaningScreen = new MeaningScreen();


  public transliteration = Transliteration.Latin;

  retrieveSong(urlKey: string, transliteration: string): Observable<SongModel> {
    return this.http.get<SongModel>(environment.javaHost + '/murshid-api/songs/findByUrlKey',
      {
        params: {
          url_key: urlKey,
          transliteration
        }
      }).pipe(
      catchError(err => {
        const message = `Could not load the song "${urlKey}"`;
        this.messagesService.showErrors(message);
        console.error(message, err);
        return throwError(err);
      })
    );
  }

  retrieveSelectorsCount(): Observable<number> {
    return this.http.get<CountWrapper>(environment.javaHost + '/murshid-api/songs/allSelectorsCount')
      .pipe(
        map(countWrapper => countWrapper.count),
        catchError((err) => {
          const message = `Could not obtain the list of songs`;
          this.messagesService.showErrors(message);
          console.error(message, err);
          return throwError(err);
        })
      );
  }


  retrieveSelectors(orderBy: OrderSongsBy, pageNumber: number): Observable<SongSelector[]> {
    return this.http.get<SongSelector[]>(environment.javaHost + '/murshid-api/songs/allSelectors',
      {
        params: {
          order_by: orderBy.toString(),
          page_number: pageNumber.toString(),
          page_size: this.globals.pageSize.toString()
        }
      })
      .pipe(
        catchError((err) => {
          console.error('error when calling /murshid-api/selector/all in retrieveAllSelectorsInitial ' + err);
          return of([]);
        })
      );
  }

  retrieveSelectorsWithTagCount(tagKey: string): Observable<number> {
    return this.http.get<CountWrapper>(environment.javaHost + '/murshid-api/songs/allSelectorsWithTagCount', {
      params: {tag_key: tagKey}
    })
      .pipe(
        map(counWrapper => counWrapper.count),
        catchError((err) => {
          console.error('error when calling /murshid-api/songs/allSelectorsWithTagCount in SongsServices,retrieveSelectorsWithTagCount' + err);
          return of(0);
        }));
  }

  retrieveSelectorsWithTag(tagKey: string, orderBy: OrderSongsBy, pageNumber: number): Observable<SongSelector[]> {
    return this.http.get<SongSelector[]>(environment.javaHost + '/murshid-api/songs/allSelectorsWithTag',
      {
        params: {
          order_by: orderBy.toString(),
          tag_key:  tagKey,
          page_number: pageNumber.toString(),
          page_size: this.globals.pageSize.toString()
        }
      });
  }

  async retrieveMeanings(meaningRequest: MeaningRequestView): Promise<MeaningResponseView> {
    return this.http.post<MeaningResponseView>(environment.javaHost + '/murshid-api/dictionaries/obtainmeaning', meaningRequest)
      .toPromise();
  }

  public populateInflectedGeo(song: SongModel): void {
    this.inflectedGeo = new Map<number, InflectedKey>();

    if (song.inflectedLines != null) {

      song.inflectedLines.forEach(entry => {
        const wlm = entry as InflectedLine;
        if (wlm.position == null) {
          alert(wlm + ' has no position');
        }
        const inflectedKey = new InflectedKey();
        inflectedKey.inflected_hindi_index = wlm.hindi_index;
        inflectedKey.inflected_hindi = wlm.hindi;
        this.inflectedGeo.set(wlm.position, inflectedKey);
      });

    } else {
      alert('No inflectedReferences found for song: ' + song.bollyName);
    }
  }

  populateNotInflectedGeo(song: SongModel): void {
    this.notInflectedGeo = new Map<number, MasterDictionaryKey[]>();

    if (song.masterLineItems != null) {
      song.masterLineItems.forEach(entry => {
        const mal: MasterLine = entry as MasterLine;
        if (!this.notInflectedGeo.has(mal.position)) {
          this.notInflectedGeo.set(mal.position, []);
        }
        const masterDictionaryKey = new MasterDictionaryKey();
        masterDictionaryKey.hindi = mal.hindi;
        masterDictionaryKey.hindi_index = mal.hindi_index;
        const masterDictionaryKeys =  this.notInflectedGeo.get(mal.position);
        if (!!masterDictionaryKeys) {
          masterDictionaryKeys.push(masterDictionaryKey);
        }
      });
    } else {
      alert('No direct masterLineItems references  found for song: ' + song.bollyName);
    }
  }


}
