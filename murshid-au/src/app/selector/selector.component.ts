import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {SelectorItem} from '../models/SelectorItem';
import {SelectorItemType} from '../models/SelectorItemType';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {SelectorsService} from '../services/selectors.service';
import {Router} from '@angular/router';
import {Transliteration} from '../models/Transliteration';
import {Scripts} from '../models/Scripts';
import {WordUtils} from '../utils/WordUtils';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {GlobalsService} from '../services/globals.service';
import {ScriptSelectionService} from "../services/script-selection.service";


interface SearchType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  encapsulation: ViewEncapsulation.None  // to override mat-select-arrow
})
export class SelectorComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions$ = new Observable<SelectorItem[]>();

  // for the magnifier button
  private selectedItem = new SelectorItem();

  // key of the searchType selected
  selectedSearchTypeValue = SelectorItemType.Song;

  searchTypes: SearchType[];

  constructor(private selectorsService: SelectorsService, private scriptSelectionService: ScriptSelectionService, private router: Router, private globals: GlobalsService, private elementRef: ElementRef, private changeDetector: ChangeDetectorRef) {

    this.searchTypes = [
      {value: SelectorItemType.Song, viewValue: 'Songs'},
      {value: SelectorItemType.Word, viewValue: 'Words'},
      {value: SelectorItemType.Singer,  viewValue: 'Singer'},
      {value: SelectorItemType.Lyricist,  viewValue: 'Lyricist'},
      {value: SelectorItemType.Composer,  viewValue: 'Composer'},
      {value: SelectorItemType.Actor,  viewValue: 'Actor'},
      {value: SelectorItemType.Tag,  viewValue: 'All Tags'},
    ];
  }

  simulateSearchTypeClick(): void {
    const searchSelectTypeControl = this.elementRef.nativeElement.querySelector('.mat-select-trigger');
    this.filteredOptions$ = of([]);
    searchSelectTypeControl.click();
  }

  obtainSelectedViewValue(): string {
    if (this.selectedSearchTypeValue === undefined) {
      return this.searchTypes[0].viewValue;
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.searchTypes.length; i++) {
        if (this.searchTypes[i].value === this.selectedSearchTypeValue) {
          return this.searchTypes[i].viewValue;
        }
      }
    }
  }

  searchTypeSelected(): void {
    this.selectedItem = new SelectorItem();
    this.myControl.setValue('');
    const inputElement = this.elementRef.nativeElement.querySelector('#searchInputText');
    switch (this.selectedSearchTypeValue) {
      case SelectorItemType.Song:
        inputElement.setAttribute('placeholder', 'Ex: साँस, سانس or Saans');
        break;
      case SelectorItemType.Word:
        inputElement.setAttribute('placeholder', 'Ex: दिल or دل or dil');
        break;
      case SelectorItemType.Tag:
        inputElement.setAttribute('placeholder', 'Ex: काजोल, کاجول or Kajol');
        break;
      case SelectorItemType.Singer:
        inputElement.setAttribute('placeholder', 'Ex: रफ़ी, رفیع or Rafi');
        break;
      case SelectorItemType.Lyricist:
        inputElement.setAttribute('placeholder', 'Ex: गुलज़ार, گلزار or Gulzar');
        break;
      case SelectorItemType.Composer:
        inputElement.setAttribute('placeholder', 'Ex: रहमान, رحمان or Rahman');
        break;
      case SelectorItemType.Actor:
        inputElement.setAttribute('placeholder', 'Ex: शाहरुख़, شاہ رخ or Shah Rukh');
        break;
      default:
        alert(`unrecognized search type ${this.selectedSearchTypeValue}`);
    }
  }

  ngOnInit(): void {
    this.selectedSearchTypeValue = SelectorItemType.Song;
    const inputElement = this.elementRef.nativeElement.querySelector('#searchInputText');
    inputElement.setAttribute('placeholder', 'Ex: साँस, سانس or Saans');

    this.myControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged())
      .subscribe(val => {
        if ((typeof val === 'string') &&  val.trim().length >= 1) {
          this.filter(val.trim());
        }
      });

  }

  somethingSelected(optionSelected: SelectorItem): void {
    const scriptType = WordUtils.scriptType(optionSelected.title);


    switch (optionSelected.type) {
      case SelectorItemType.Song:
        switch (scriptType) {
          case Scripts.DEVANAGARI:
            this.globals.transliteration = Transliteration.Hindi;
            break;
          case Scripts.NASTALIQ:
            this.globals.transliteration = Transliteration.Urdu;
            break;
          default:
            this.globals.transliteration = Transliteration.Latin;
            break;
        }
        this.router.navigate(['/song/' + this.scriptSelectionService.getCurrentScript().toString() + '/' + optionSelected.key], {});
        break;
      case SelectorItemType.Tag:
      case SelectorItemType.Actor:
      case SelectorItemType.Composer:
      case SelectorItemType.Lyricist:
      case SelectorItemType.Singer:
        this.router.navigate(['/tag/' + optionSelected.key]);
        break;
      case SelectorItemType.Word:
        let word = null;
        switch (scriptType) {
          case Scripts.DEVANAGARI:
          case Scripts.LATIN:
            word = optionSelected.hindi.trim();
            break;
          case Scripts.NASTALIQ:
            word = optionSelected.urdu.trim();
            break;
          default:
            alert('script type of ' + optionSelected.title + ' not recognized');
            break;
        }
        if (!!word) {
          this.router.navigate(['/dictionary/' + word]);
        }
    }
  }

  onKeydown($event: KeyboardEvent): void {
    this.somethingSelected(this.selectedItem);
  }

  displayFn(item?: SelectorItem): string | undefined {
    if (!this.myControl || ! this.myControl.value) {
      return undefined;
    }
    const substring = typeof this.myControl.value as string;
    const scriptType = WordUtils.scriptType(substring);
    switch (scriptType) {
      case Scripts.DEVANAGARI:
        return item ? item.hindi : undefined;
      case Scripts.NASTALIQ:
        return item ? item.urdu
          .replace('~', ' ')
          .replace('-', ' ') : undefined;
      default:
        return item ? item.title : undefined;
    }
  }

  filter(val: string): void {
    this.filteredOptions$ = this.selectorsService.retrieveSelectors(this.selectedSearchTypeValue, val);
  }
}
