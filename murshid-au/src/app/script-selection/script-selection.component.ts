import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Transliteration} from '../models/Transliteration';
import {GlobalsService} from '../services/globals.service';
import {ScriptSelectionService} from '../services/script-selection.service';
import {EnumUtils} from '../utils/EnumUtils';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';



@Component({
  selector: 'app-script-selection',
  templateUrl: './script-selection.component.html',
  styleUrls: ['./script-selection.component.scss']
})
export class ScriptSelectionComponent implements OnInit {


  @Output()
  scriptSelect: EventEmitter<Transliteration> = new EventEmitter();

  selectedScript$: Observable<string> = new Observable<Transliteration>();


  constructor(private globals: GlobalsService, private scriptSelectionService: ScriptSelectionService) {

  }

  ngOnInit(): void {
    this.selectedScript$ = this.scriptSelectionService.scriptSelected.pipe(
      map(transliteration => EnumUtils.stringFromTransliteration(transliteration) ))
    ;
  }

  transliterationSelected(trans: string): void {
    const selected = EnumUtils.transliterationFromString(trans);
    this.scriptSelectionService.setScript(selected);
    this.scriptSelect.emit(selected);
  }
}
