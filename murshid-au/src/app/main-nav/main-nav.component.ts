import {Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {GlobalsService} from '../services/globals.service';
import {Router} from '@angular/router';
import {PaginationService} from '../services/pagination.service';
import {Section} from '../models/Section';
import {environment} from '../../environments/environment';
import {SelectorComponent} from '../selector/selector.component';
import {OrderByService} from '../services/order-by.service';
import {EnumUtils} from '../utils/EnumUtils';
import {PaginationUtils} from '../utils/PaginationUtils';
import {SongsService} from '../services/songs.service';
import {ScriptSelectionService} from '../services/script-selection.service';
import {Pagination} from '../models/Pagination';

declare var $: any;

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  @ViewChild(SelectorComponent)
  selectorComponent: SelectorComponent | undefined;


  constructor(private breakpointObserver: BreakpointObserver, public globals: GlobalsService, private router: Router, private paginationService: PaginationService,
              private orderByService: OrderByService, private songsService: SongsService,
              private scriptSelectionService: ScriptSelectionService ) {
    globals.section = Section.Cover;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.scriptSelectionService.scriptSelected.subscribe( transliteration => {
        if (this.globals.urlKey) {
          this.router.navigate(['/song/' + EnumUtils.latinStringFromTransliteration(transliteration) + '/' + this.globals.urlKey], {});
        }
      }
    );
  }

  homeSelected(): void{
    if (this.selectorComponent !== undefined) {
      this.selectorComponent.searchTypeSelected();
    }
    this.paginationService.changePagination(new Pagination());
    this.globals.section = Section.Cover;
    this.router.navigate(['/']).then(
      () => this.songsService.retrieveSelectorsCount()
        .toPromise()
        .then(count => {
          const pagination = PaginationUtils.start(this.globals, count);
          this.paginationService.changePagination(pagination);
        })
    );
  }

  allTagsSelected(): void {
    this.globals.section = Section.AllTags;
    // this.globals.transliteration = null;
    this.router.navigate(['/all-tags'], {});
  }


  getVersion(): string {
    return 'Version ' + environment.buildNumber;
  }

  orderSongsBySelected(orderSongsBy: string): void {
    this.orderByService.changeOrder(EnumUtils.sortFromString(orderSongsBy));
  }


}
