import {Component, OnInit} from '@angular/core';
import {SongSelector} from '../models/SongSelector';
import {PaginationService} from '../services/pagination.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SongsService} from '../services/songs.service';
import {GlobalsService} from '../services/globals.service';
import {TagsService} from '../services/tags.service';
import {Meta, Title} from '@angular/platform-browser';
import {PaginationUtils} from '../utils/PaginationUtils';
import {Section} from '../models/Section';
import {OrderByService} from '../services/order-by.service';

@Component({
  selector: 'app-regular-cover',
  templateUrl: './regular-cover.component.html',
  styleUrls: ['./regular-cover.component.scss']
})
export class RegularCoverComponent implements OnInit {

  public songSelectors: SongSelector[] = [];

  constructor(private paginationService: PaginationService, private route: ActivatedRoute, private router: Router, private songsService: SongsService,
              private globals: GlobalsService, private tagsService: TagsService, private orderByService: OrderByService,
              private title: Title, private meta: Meta) {

    this.songsService.retrieveSelectorsCount()
      .toPromise()
      .then(count => {
        const pagination = PaginationUtils.start(this.globals, count);
        this.paginationService.changePagination(pagination);
      });
  }

  ngOnInit(): void {
    this.globals.section = Section.Cover;
    this.title.setTitle('Hindustani Songs');
    this.meta.updateTag({name: 'description', content: 'Lyrics of Hindi and Urdu songs, with word-by-word dictionary meanings'});

    this.paginationService.getObservable().subscribe(pagination => {
      if (!pagination) {
        return; // because we are not sure of the exact order in which these events are received
      }
      let page = pagination.pages[pagination.activePageIndex];
      if (!page) {
        page = 1;
      }
      this.songsService.retrieveSelectors(this.orderByService.getOrder(), page - 1)
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







}
