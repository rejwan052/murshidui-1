import {ChangeDetectorRef, Component, ElementRef, Inject, InjectionToken, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {Transliteration} from '../models/Transliteration';
import {SongModel} from '../models/SongModel';
import {ActivatedRoute, Router} from '@angular/router';
import {SongsService} from '../services/songs.service';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {GlobalsService} from '../services/globals.service';
import {isPlatformBrowser} from '@angular/common';
import {Section} from '../models/Section';
import {EnumUtils} from '../utils/EnumUtils';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {filter, flatMap, map, pairwise, shareReplay, startWith, tap} from 'rxjs/operators';
import {Tag} from '../models/Tag';
import {ImportantParams} from "../models/ImportantUrlParams";


@Component({
  selector: 'app-songplain',
  templateUrl: './songplain.component.html',
  styleUrls: ['./songplain.component.scss']
})
export class SongplainComponent implements OnInit {

  private sub: any;
  public script = Transliteration.Latin;
  private urlKey = '';
  public songModel$ = new Observable<SongModel>();
  public bollyName$ = new Observable<string>();
  public tags$ = new Observable<Tag[]>();
  public plainHtml$ = new Observable<string>();
  public isBrowser;
  public languageParagraphDir = 'ltr';
  public languageParagraphClass =  '';
  public languagePunctuationClass = '';
  // the first time, the video doesn't seekTo() correctly
  // so cueVideo(... with a start seconds) has to be used instead
  private clickedOnce: boolean;

  public clickableDictionaryLink = '';
  private importantParams$ = new Observable<ImportantParams>();


  constructor(private route: ActivatedRoute, private router: Router, private songsService: SongsService, private elementRef: ElementRef,
              private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: InjectionToken<object>, private changeDetector: ChangeDetectorRef,
              private title: Title, private meta: Meta, private globals: GlobalsService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.clickedOnce = false;
  }

  ngOnInit(): void {
    this.globals.section = Section.Song;
    let attributeSelector  = 'name="description"';
    this.meta.removeTag(attributeSelector);
    attributeSelector  = 'name="og:image"';
    this.meta.removeTag(attributeSelector);


    this.importantParams$ = this.route.params.pipe(
      shareReplay(),
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

    this.songModel$ = this.importantParams$.pipe(
      flatMap((param) => {
        return this.songsService.retrieveSong(param.urlKey, param.script);
      }),
      shareReplay(),
      tap(songModel => {
        if (songModel != null) {
          this.title.setTitle(this.buildTitle(songModel));
          this.meta.updateTag({name: 'description', content: songModel.metaDescription});
          this.meta.updateTag({
            name: 'og:image',
            content: environment.imageServer + '/video-thumbnails/' + songModel.urlKey + environment.jpegExtension
          });
        }
        this.updateContainerContent(songModel);
      })
    );

    this.bollyName$ = this.songModel$
      .pipe(
        map(songModel => songModel.bollyName)
      );
    this.tags$ = this.songModel$
      .pipe(
        map(songModel => songModel.tags)
      );
    this.plainHtml$ = this.songModel$
      .pipe(
        map(songModel => songModel.plainHtml)
      );

    this.changeDetector.detectChanges();

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

  buildDescription(songModel: SongModel, transliteration: Transliteration): string {
    switch (transliteration) {
      case Transliteration.Hindi:
        return 'Lyrics of the song ' + songModel.bollyName + ' in Hindi, written in Devanagari Script, with line-by-line English translation';
      case Transliteration.Urdu:
        return 'Lyrics of the song ' + songModel.bollyName + ' in Urdu, written in Nastaliq Script, with line-by-line English translation';
      default:
        return 'Lyrics of the song ' + songModel.bollyName + ' written in Latin letters, transliterated using the ISO-15919 latinization system, with line-by-line English translation';
    }
  }


  updateContainerContent(songModel: SongModel): void {

    this.songsService.transliteration = this.script;
    this.songsService.populateInflectedGeo(songModel);
    this.songsService.populateNotInflectedGeo(songModel);


    switch (this.script) {
      case Transliteration.Hindi:
        this.languageParagraphDir = 'lrt';
        this.languageParagraphClass = 'language-ltr-paragraph';
        this.languagePunctuationClass = 'ltrPunctuationMark';
        break;
      case Transliteration.Urdu:
        this.languageParagraphDir = 'rtl';
        this.languageParagraphClass = 'urdu-paragraph';
        this.languagePunctuationClass = 'rtlPunctuationMark';
        break;
      case Transliteration.Latin:
        this.languageParagraphDir = 'lrt';
        this.languageParagraphClass = 'language-ltr-paragraph';
        this.languagePunctuationClass = 'ltrPunctuationMark';
        break;
    }

    this.changeDetector.detectChanges();
  }

  navigateToClickableDictionary(): void {
    this.router.navigate([this.clickableDictionaryLink], {});
  }

}
