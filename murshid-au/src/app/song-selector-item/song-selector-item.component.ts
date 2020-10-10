import {
  Component,
  ElementRef,
  Input,
  OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {GlobalsService} from '../services/globals.service';
import {Transliteration} from '../models/Transliteration';
import {SongSelector} from '../models/SongSelector';
import {ScriptSelectionService} from '../services/script-selection.service';
import {EnumUtils} from '../utils/EnumUtils';

@Component({
  selector: 'app-song-selector-item',
  templateUrl: './song-selector-item.component.html',
  styleUrls: ['./song-selector-item.component.scss']
})
export class SongSelectorItemComponent implements OnInit {

  @Input()
  songSelectorItem: SongSelector = new SongSelector();

  public imageUrl = '';

  @Input()
  public selectorIndex = 0;



  constructor(private ref: ElementRef,  public scriptSelectionService: ScriptSelectionService) {
  }

  public transliterationAsString(): string {
    return EnumUtils.latinStringFromTransliteration(this.scriptSelectionService.getCurrentScript());
  }

  ngOnInit(): void {
    this.imageUrl = environment.imageServer + '/video-thumbnails/' + this.songSelectorItem.urlKey + environment.jpegExtension;
  }

}
