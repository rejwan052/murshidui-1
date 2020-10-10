import { Injectable } from '@angular/core';
import {Transliteration} from '../models/Transliteration';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {Section} from '../models/Section';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  partsOfSpeech: any;
  accidenceTypes: any;
  transliteration =  Transliteration.Latin;
  urlKey = '';
  section = Section.Cover;
  orderSongsBy =  OrderSongsBy.post;
  /**
   * The size in items of each song listing page
   */
  pageSize = 10;

  /**
   * the maximum number of page links to display in the paginator
   */
  maxPagesDisplayed = 5;

  shiftLowerBound = 2;
  shiftUpperBound = 4;
}
