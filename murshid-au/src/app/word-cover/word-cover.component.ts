import {Component, OnInit} from '@angular/core';
import {PaginationService} from '../services/pagination.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {GlobalsService} from '../services/globals.service';
import {TagsService} from '../services/tags.service';
import {Meta, Title} from '@angular/platform-browser';
import {UrlUtils} from '../utils/UrlUtils';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {WordUtils} from '../utils/WordUtils';
import {Scripts} from '../models/Scripts';
import {PaginationUtils} from '../utils/PaginationUtils';
import {SongSelector} from '../models/SongSelector';
import {DictionaryService} from '../services/dictionary.service';
import {DictionaryView} from '../models/DictionaryView';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Section} from '../models/Section';
import {OrderByService} from '../services/order-by.service';
import {EnumUtils} from "../utils/EnumUtils";

@Component({
  selector: 'app-word-cover',
  templateUrl: './word-cover.component.html',
  styleUrls: ['./word-cover.component.scss']
})
export class WordCoverComponent implements OnInit {


  public searchWord: string;
  public scriptType: Scripts;
  songSelectors: SongSelector[];
  dictionaryViews$: Observable<DictionaryView[]>;


  constructor(private paginationService: PaginationService, private route: ActivatedRoute, private router: Router, private dictionaryService: DictionaryService,
              private globals: GlobalsService, private tagsService: TagsService, private orderByService: OrderByService,
              private title: Title, private meta: Meta) {

    this.searchWord = '';
    this.scriptType = Scripts.LATIN;
    this.songSelectors = [];
    this.dictionaryViews$ = new Observable<DictionaryView[]>();

    const word = this.route.snapshot.paramMap.get('word');
    const sort = this.route.snapshot.paramMap.get('sort');

    if (!word) {
      return;
    }

    this.searchWord = decodeURIComponent(word);
    this.scriptType = WordUtils.scriptType(word);

    this.globals.orderSongsBy = EnumUtils.sortFromString(sort) || OrderSongsBy.post;

    this.dictionaryViews$ = this.dictionaryService.searchWord(this.searchWord)
      .pipe(
        tap(dictionaryViews => this.buildTitleAndDescription(this.searchWord, dictionaryViews))
      );

    this.dictionaryService.songCountByWord(this.searchWord)
      .toPromise()
      .then(count => {
        const pagination = PaginationUtils.start(this.globals, count);
        this.paginationService.changePagination(pagination);
      });
  }



  ngOnInit(): void {
    this.globals.section = Section.Cover;

    this.paginationService.getObservable().subscribe(pagination => {
      if (!pagination) {
        return; // because we are not sure of the exact order in which these events are received
      }
      let page = pagination.pages[pagination.activePageIndex];
      if (!page) {
        page = 1;
      }
      this.dictionaryService.searchSelectors(this.searchWord, this.orderByService.getOrder(),  this.globals.pageSize, page - 1)
        .toPromise()
        .then(selectors => {
          this.songSelectors = selectors;
        });
    });

    // if there is a change in the sort order, just reset the pagination so that the selectors are requeried
    this.orderByService.getObservable().subscribe( orderBy => {

      const servicePagination = this.paginationService.getPagination();
      if (!servicePagination) {
        return; // because we are not sure of the exact order in which these events are received
      }
      const pagination = PaginationUtils.start(this.globals, servicePagination.itemCount);
      this.paginationService.changePagination(pagination);

    });

  }



  buildTitleAndDescription(searchWord: string, dictionaryViews: DictionaryView[]): void {
    const script = WordUtils.scriptType(searchWord);

    let description = dictionaryViews.length + ' English meaning(s) were found ';

    switch (script) {
      case Scripts.NASTALIQ:
        this.title.setTitle('Urdu Dictionary, meaning of: ' + searchWord );
        description += ' for the Urdu term ' + searchWord + ' :\n';
        break;
      case Scripts.DEVANAGARI:
        this.title.setTitle('Hindi Dictionary, meaning of: ' + searchWord );
        description += ' for the Hindi term ' + searchWord + ' :\n';
        break;
      default:
        this.title.setTitle('Hindustani Dictionary, meaning of: ' + searchWord );
        description += ' for the Hindustani term ' + searchWord + ' :\n';
        break;
    }

    for (let i = 0; i < dictionaryViews.length; i++) {
      description += dictionaryViews[i].meaning;
      if (i < (dictionaryViews.length - 1)) {
        description += '\n';
      }
    }
    this.meta.updateTag({ name: 'description', content: description});
  }


}
