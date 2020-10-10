import {Component, OnInit} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {IEnum} from './models/IEnum';
import {environment} from '../environments/environment';
import {Meta} from '@angular/platform-browser';
// @ts-ignore
import partsOfSPeech from '../assets/json/partsOfSpeech.json';
// @ts-ignore
import * as accidenceTypes from '../assets/json/accidenceTypes.json';
import {GlobalsService} from './services/globals.service';
import {PaginationService} from './services/pagination.service';
import {UrlUtils} from './utils/UrlUtils';
import {PaginationUtils} from './utils/PaginationUtils';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor( private globals: GlobalsService, private http: HttpClient, private meta: Meta, private paginationService: PaginationService,
               public breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.meta.updateTag({ name: 'theme-color', content: '#FBFBFB'});

    if (environment.cachedApiCalls) {
      const pos = partsOfSPeech as unknown;
      this.globals.partsOfSpeech = pos as IEnum;

      const accType = accidenceTypes as unknown;
      this.globals.accidenceTypes = accType as IEnum;

    } else {
      this.http.get<IEnum>( environment.javaHost + '/murshid-api/domain/partsOfSpeech')
        .subscribe(data => {
          if ( data != null ) {
            this.globals.partsOfSpeech = data;
          } else {
            alert('Parts of speech not received');
          }
        });

      this.http.get<IEnum>( environment.javaHost + '/murshid-api/domain/accidenceTypes')
        .subscribe(data => {
          if ( data != null ) {
            this.globals.accidenceTypes = data;
          } else {
            alert('Accidence types not received');
          }
        });

    }


  }

}
