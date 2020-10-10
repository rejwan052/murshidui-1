import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import { Subscription } from 'rxjs';


import {GlobalsService} from '../services/globals.service';
import {Pagination} from '../models/Pagination';
import {PaginationService} from '../services/pagination.service';
import {PaginationUtils} from '../utils/PaginationUtils';


@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit, OnDestroy {


  public pagination = new Pagination();
  private subscription: Subscription;

  constructor(private globals: GlobalsService, private paginationService: PaginationService) {
    this.subscription = this.paginationService.getObservable().subscribe(message => {
      this.pagination = message;
      // this.ngOnInit();
    });
  }

  shouldGrayPage(page: number): boolean {
    const activeIndex = this.pagination.activePageIndex;
    const activePage = this.pagination.pages[activeIndex];
    return page === activePage;
  }

  ngOnInit(): void {
    this.pagination = this.paginationService.getPagination();
  }


  pagerNextClicked(event: Event): void {
    const pagination = PaginationUtils.actionNext(this.globals, this.paginationService.getPagination());
    this.paginationService.changePagination(pagination);
  }

  pagerPreviousClicked(event: Event): void {
    const pagination = PaginationUtils.actionPrevious(this.globals, this.paginationService.getPagination());
    this.paginationService.changePagination(pagination);
  }

  pagerPageClicked(page: number): void {
    // tslint:disable-next-line:radix
    const pagination = PaginationUtils.forcePageSelection(this.paginationService.getPagination(), page);
    this.paginationService.changePagination(pagination);
  }

  //
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
