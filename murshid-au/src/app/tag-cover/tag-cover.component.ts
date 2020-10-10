import {Component, OnDestroy, OnInit} from '@angular/core';
import {SongSelector} from '../models/SongSelector';
import {PaginationService} from '../services/pagination.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {SongsService} from '../services/songs.service';
import {GlobalsService} from '../services/globals.service';
import {TagsService} from '../services/tags.service';
import {Meta, Title} from '@angular/platform-browser';
import {UrlUtils} from '../utils/UrlUtils';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {Section} from '../models/Section';
import {Tag} from '../models/Tag';
import {PaginationUtils} from '../utils/PaginationUtils';
import {combineLatest, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {OrderByService} from '../services/order-by.service';

@Component({
  selector: 'app-tag-cover',
  templateUrl: './tag-cover.component.html',
  styleUrls: ['./tag-cover.component.scss']
})
export class TagCoverComponent implements OnInit, OnDestroy {

  public songSelectors: SongSelector[] = [];
  public tagDescription = '';
  public tagKey = '';
  tag$ = new Observable<Tag>();


  constructor(private paginationService: PaginationService, private route: ActivatedRoute, private router: Router, private songsService: SongsService,
              private globals: GlobalsService, private tagsService: TagsService,  private orderByService: OrderByService,
              private title: Title, private meta: Meta) {



    this.route.url.subscribe((s: UrlSegment[]) => {
      const urlElements = UrlUtils.extractElements(this.route);
      let tagKey: string;
      if (urlElements.tag) {
        tagKey = decodeURI(urlElements.tag.valueOf());
        this.tagKey = decodeURIComponent(tagKey);

        this.globals.orderSongsBy = urlElements.sort || OrderSongsBy.post;

        this.tag$ = this.tagsService.getTag(this.tagKey)
          .pipe(
            tap(tag => this.builtTitleAndDescription(tag))
          );
        this.tagsService.songCountByTag(this.tagKey)
          .toPromise()
          .then(count => {
            const pagination = PaginationUtils.start(this.globals, count);
            this.paginationService.changePagination(pagination);
          });
      }


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
      this.tagsService.searchSelectors(this.tagKey, this.orderByService.getOrder(),  this.globals.pageSize, page - 1)
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


  builtTitleAndDescription(tag: Tag): void {
    this.title.setTitle(tag.title);
    this.meta.updateTag({name: 'description', content: tag.description});
    this.tagDescription = tag.description;
  }

  ngOnDestroy(): void {

  }

}
