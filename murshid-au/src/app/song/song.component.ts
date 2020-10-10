import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  HostListener, InjectionToken
} from '@angular/core';

import {SongsService} from '../services/songs.service';
import {Transliteration} from '../models/Transliteration';
import {Section} from '../models/Section';
import {ActivatedRoute,  Router} from '@angular/router';
import {SongModel} from '../models/SongModel';
import {isPlatformBrowser} from '@angular/common';
import {Observable, throwError} from 'rxjs';
import {
  catchError,
  distinctUntilKeyChanged,
  filter, finalize,
  flatMap,
  map,
  pairwise,
  shareReplay,
  startWith,
  tap
} from 'rxjs/operators';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {GlobalsService} from '../services/globals.service';
import {DictionaryDefinitionComponent} from './dictionary-definition/dictionary-definition.component';
import {environment} from '../../environments/environment';
import {ImportantParams} from '../models/ImportantUrlParams';
import {UseNastaliqService} from '../services/use-nastaliq.service';
import {Tag} from '../models/Tag';
import {MatDialog} from '@angular/material/dialog';
import {LoadingService} from "../services/loading.service";




@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-song]',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongComponent implements OnInit {


  public songModel$ = new Observable<SongModel>();
  public bollyName$ = new Observable<string>();
  public tags$ = new Observable<Tag[]>();

  private player: any;
  private ytEvent: any;
  public isBrowser;
  public showNastaliqOption = false;
  public nastaliqCalligraphy =  true;

  // private deployed;
  public languageParagraphDir$ = new Observable<string>();
  public languageParagraphClass$ = new Observable<string>();
  public languagePunctuationClass$ = new Observable<string>();
  // the first time, the video doesn't seekTo() correctly
  // so cueVideo(... with a start seconds) has to be used instead
  private clickedOnce: boolean;
  public plainTextLink$ = new Observable<string>();
  public transliteration$ = new Observable<Transliteration>();
  public description$ = new Observable<string>();
  public videoUrl$ = new Observable<string>();
  public innerWidth: any;

  private importantParams$ = new Observable<ImportantParams>();

  constructor(private route: ActivatedRoute, private router: Router, private songsService: SongsService,
              @Inject(PLATFORM_ID) private platformId: InjectionToken<object>, private loadingService: LoadingService,
              private title: Title, private meta: Meta, private globals: GlobalsService, public dialog: MatDialog,
              private sanitizer: DomSanitizer, public useNastaliqService: UseNastaliqService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.clickedOnce = false;
  }



  ngOnInit(): void {
    this.globals.section = Section.Song;
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth = window.innerWidth;
    }
    let attributeSelector = 'name="description"';
    this.meta.removeTag(attributeSelector);
    attributeSelector = 'name="og:image"';
    this.meta.removeTag(attributeSelector);


    this.importantParams$ = this.route.params.pipe(
      // shareReplay(),
      startWith( new ImportantParams()),
      pairwise(),
      filter(([prev, next]) => {

        const someUndefined = next.urlKey === undefined || next.script === undefined || next.urlKey === 'undefined';
        const distinctFrombefore = (prev.urlKey !== next.urlKey) || (prev.script !== next.script);

        if (someUndefined) {
          return false;
        } else if (!distinctFrombefore) {
          return false;
        }
        return true;
      }),
      // flatMap(arr => arr[1]),
      map(arr => {
        const p = new ImportantParams();
        p.urlKey = arr[1].urlKey;
        p.script = arr[1].script;
        return p;
      }),
      tap(param => {
        this.globals.urlKey = param.urlKey;
      }),
    );

    this.loadingService.loadingOn();

    this.songModel$ = this.importantParams$.pipe(
      flatMap((param) => {
        console.log('retrieving song');
        return this.songsService.retrieveSong(param.urlKey, param.script);
      }),
      tap(songModel => {
        console.log('tapping');
        this.title.setTitle(this.buildTitle(songModel));
        this.meta.updateTag({name: 'description', content: songModel.metaDescription});
        this.meta.updateTag({
          name: 'og:image',
          content: environment.imageServer + '/video-thumbnails/' + songModel.urlKey + environment.jpegExtension
        });
        this.updateContainerContent(songModel);
      }),
      catchError(err => {
        this.loadingService.loadingOff();
        return throwError(err);
      }),
      shareReplay()
    );

    this.plainTextLink$ = this.songModel$.pipe(
      map(songModel =>  {
        return  '/song-lyrics/' + songModel.transliteration.toString() + '/' + songModel.urlKey;
      })
    );

    this.description$ = this.songModel$.pipe(
      map(songModel =>  songModel.description),
      startWith('')
    );

    this.bollyName$ = this.songModel$.pipe(
      map(songModel =>  songModel.bollyName),
      startWith('')
    );



    this.tags$ = this.songModel$.pipe(
      map(songModel => songModel.tags),
      startWith([])
    );

    this.videoUrl$ = this.songModel$.pipe(
      map(songModel => songModel.videoUrl),
      tap( videoUrl => {
        if (this.player) {
          this.player.cueVideoById(videoUrl);
        }
      })
    );


    this.transliteration$ = this.songModel$.pipe(
      map(songModel => songModel.transliteration),
      startWith(Transliteration.Hindi)
    );


    this.languageParagraphDir$ = this.importantParams$.pipe(
      map(param => {
        switch (param.script) {
          case 'Urdu':
            return 'rtl';
          default:
            return 'lrt';
        }
      })
    );

    this.languageParagraphClass$ = this.importantParams$.pipe(
      map(param => {
        switch (param.script) {
          case 'Urdu':
            return 'urdu-paragraph';
          default:
            return 'language-ltr-paragraph';
        }
      })
    );

    this.languagePunctuationClass$ = this.importantParams$.pipe(
      map(param => {
        switch (param.script) {
          case 'Urdu':
            return'rtlPunctuationMark';
          default:
            return 'ltrPunctuationMark';
        }
      })
    );



  }

  buildTitle(songModel: SongModel): string {
    switch (songModel.transliteration) {
      case Transliteration.Hindi:
        return songModel.bollyName + ' Lyrics Hindi | ' + songModel.hindiTitle + ' lyrics';
      case Transliteration.Urdu:
        return songModel.bollyName + ' Lyrics Urdu | lyrics ' + songModel.urduTitle;
      default:
        return songModel.bollyName + ' Lyrics';
    }
  }

  openDialog(): void {
    this.dialog.open(DictionaryDefinitionComponent, {
      width: '500px'
    });


  }

  timeClicked(seconds: number, videoId: any): void {
    if (this.player != null && this.isBrowser) {
      if (!this.clickedOnce) {
        this.player.cueVideoById(videoId, seconds);
        this.clickedOnce = true;
      } else {
        this.player.seekTo(seconds, true);
      }
      this.player.playVideo();
    }
  }

  pauseClicked(): void {
    // evt.stopImmediatePropagation();
    if (this.player != null && this.isBrowser) {
      this.player.pauseVideo();
    }
  }


  updateContainerContent(songModel: SongModel): void {
    this.nastaliqCalligraphy = this.showNastaliqOption;

    if (songModel) {
      // this.songModel = await this.songsService.retrieveSong(this.urlKey);
      if (!songModel.urlKey) {
        this.router.navigateByUrl('/');
        return;
      }

      this.songsService.transliteration = songModel.transliteration;
      this.songsService.populateInflectedGeo(songModel);
      this.songsService.populateNotInflectedGeo(songModel);
    }
    this.loadingService.loadingOff();
  }

  toggleNastaliq($event: any): void {
    this.useNastaliqService.setNastaliq(!!$event.checked);
  }

  wordClicked(id: number): void {
    this.songsService.itemHoverChange.next(id.toString());
    this.openDialog();
  }

  lessThan100Width(): boolean {
    return this.innerWidth <= 1000;
  }

  navigateToPlain(plainTextLink: string): void {
    this.router.navigate([plainTextLink], {});
  }

  onStateChange(event: any): void {
    this.ytEvent = event.data;
  }

  savePlayer(player: any, videoId: any): void {
    this.player = player;
    this.player.cueVideoById(videoId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.player) {
      return;
    }
    const iframeTop = this.player.f.offsetTop;
    if (window.pageYOffset > iframeTop) {
      this.player.f.classList.add('sticky');
    } else {
      this.player.f.classList.remove('sticky');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.innerWidth = event.target.innerWidth;
  }

}
