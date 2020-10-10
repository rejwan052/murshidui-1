import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {WordUtils} from '../utils/WordUtils';
import {Scripts} from '../models/Scripts';
import {DictionaryService} from '../services/dictionary.service';
import {combineLatest, Observable} from 'rxjs';
import {DictionaryView} from '../models/DictionaryView';
import {SongSelector} from '../models/SongSelector';
import { filter, map, pairwise, shareReplay} from 'rxjs/operators';
import {OrderByService} from '../services/order-by.service';
import {flatMap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit, OnDestroy {

  private sub: any;
  dictionaryViews$: Observable<DictionaryView[]> = new Observable<DictionaryView[]>();
  songSelectors$: Observable<SongSelector[]> = new Observable<SongSelector[]>();
  searchWord =  new Observable<string>();
  scriptType: Scripts = Scripts.LATIN;

  constructor(private route: ActivatedRoute, private title: Title, private meta: Meta, private dictionaryService: DictionaryService, private orderByService: OrderByService) { }

  ngOnInit(): void {
    this.searchWord = this.route.params.pipe(
      shareReplay(),
      pairwise(),
      filter(([prev, next]) => {

        const someUndefined = next.word === undefined ||  next.word === 'undefined';
        const distinctFrombefore = (prev.word !== next.word);

        if (someUndefined) {
          return false;
        } else if (!distinctFrombefore) {
          return false;
        }
        return true;
      }),
      map(arr => arr[1].word)
    );

    this.dictionaryViews$ =   this.searchWord.pipe(
      flatMap(word => this.dictionaryService.searchWord(word))
    );

    this.songSelectors$ =   this.searchWord.pipe(
      flatMap(word => this.dictionaryService.searchSelectors(word, this.orderByService.getOrder(), 100, 0))
    );

    combineLatest(this.songSelectors$, this.dictionaryViews$, this.searchWord,  (songSelectors, dictionaryViews, searchWord ) => ({songSelectors, dictionaryViews, searchWord}))
      .subscribe (trio => {
        this.buildTitleAndDescription(trio.searchWord, trio.songSelectors, trio.dictionaryViews);
      });



  }

  thereAreDictionaryviews(dictionaryViews: DictionaryView[] | null): boolean {
    if (!dictionaryViews) {
      return false;
    } else {
      return dictionaryViews && dictionaryViews.length > 0;
    }
  }


  thereAreSongSelectors(songSelectors: SongSelector[] | null): boolean {
    if (!songSelectors) {
      return false;
    } else {
      return songSelectors && songSelectors.length > 0;
    }
  }

  buildTitleAndDescription(searchWord: string,  songSelectors: SongSelector[], dictionaryViews: DictionaryView[]): void {
    const script = WordUtils.scriptType(searchWord);

    let description = dictionaryViews.length + ' English meaning(s) were found ';

    if (script === Scripts.NASTALIQ) {
      this.title.setTitle('Urdu Dictionary, meaning of: ' + this.searchWord );
      description += ' for the Urdu term ' + this.searchWord + ' :\n';
    } else if (script === Scripts.DEVANAGARI) {
      this.title.setTitle('Hindi Dictionary, meaning of:  ' + this.searchWord );
      description += ' for the Hindi term ' + this.searchWord + ' :\n';
    }

    for (let i = 0; i < dictionaryViews.length; i++) {
      description += dictionaryViews[i].meaning;
      if (i < (dictionaryViews.length - 1)) {
        description += '\n';
      }
    }
    this.meta.updateTag({ name: 'description', content: description});
  }

  ngOnDestroy(): void{
    // in tests, sub might be null
    if (this.sub != null) {
      this.sub.unsubscribe();
    }
  }

}
