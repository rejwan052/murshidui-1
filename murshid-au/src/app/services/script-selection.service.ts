import {Inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Transliteration} from '../models/Transliteration';
import {EnumUtils} from '../utils/EnumUtils';
import {isPlatformBrowser} from '@angular/common';

const CHOSEN_SCRIPT = 'chosen_script';

@Injectable({
  providedIn: 'root'
})
export class ScriptSelectionService {

  private scriptSelectionSubject = new BehaviorSubject<Transliteration>(Transliteration.Hindi);
  public scriptSelected = this.scriptSelectionSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<object>) {
    if (isPlatformBrowser(this.platformId)) {
      const chosenScript = localStorage.getItem(CHOSEN_SCRIPT);
      if (chosenScript) {
        const newTrans = EnumUtils.transliterationFromLatinString(chosenScript);
        this.scriptSelectionSubject.next(newTrans);
      }
    }
  }

  setScript(script: Transliteration): void {
    this.scriptSelectionSubject.next(script);
    if (isPlatformBrowser(this.platformId)){
      localStorage.setItem(CHOSEN_SCRIPT, script);
    }
  }

  getCurrentScript(): Transliteration {
    return this.scriptSelectionSubject.getValue();
  }
}
