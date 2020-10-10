import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  Output,
  PLATFORM_ID
} from '@angular/core';
import {ParagraphWord} from '../../models/ParagraphWord';
import {ParagraphBlock} from '../../models/ParagraphBlock';
import {isPlatformBrowser} from '@angular/common';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {UseNastaliqService} from '../../services/use-nastaliq.service';
declare var $: any;

@Component({
  selector: 'app-language-line',
  templateUrl: './language-line.component.html',
  styleUrls: ['./language-line.component.scss']
})
export class LanguageLineComponent implements OnInit {

  @Input()
  block = new ParagraphBlock();

  @Output()
  timeClick: EventEmitter<number> = new EventEmitter();

  @Output()
  pauseClick: EventEmitter<any> = new EventEmitter();

  @Output()
  wordClick: EventEmitter<number> = new EventEmitter();


  @Input()
  languagePunctuationClass = '';

  @Input()
  languageParagraphClass = '';

  @Input()
  languageParagraphDir = '';

  @Input()
  isUrdu = false;


  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<object>, public useNastaliqService: UseNastaliqService) {
  }

  ngOnInit(): void {
    this.evaluateShowTranslation();
  }

  evaluateShowTranslation(): void {
    if (isPlatformBrowser(this.platformId)) {
      const body = $('body');
      if (body.width() < 1000) {
        body.find('.english-paragraph').hide();
      } else {
        body.find('.english-paragraph').show();
      }
    }
  }

  timeClicked(): void {
    const minutes = this.block.minutes ? this.block.minutes.valueOf() : 0;
    this.timeClick.emit(minutes * 60 + this.block.seconds.valueOf() );
  }

  wordClicked(id: number): void {
    this.wordClick.emit(id);
  }


  pauseClicked(): void{
    this.pauseClick.emit(null);
  }

  toggleVisibilityLanguagePanel(evt: Event): void {
    if (!this.lessThan100Width()) {
      return;
    }

    evt.stopImmediatePropagation();

    let elementClicked = $(evt.target);

    if (elementClicked.hasClass('paragraph-line')) {
      elementClicked = elementClicked.parent();
    }

    if (elementClicked.hasClass('language-ltr-paragraph') || elementClicked.hasClass('urdu-paragraph')) {
      const language = elementClicked;
      const translation = $(language).siblings().first();

      $(language).fadeToggle(150, () => {
        // $(translation).find('span').show();
        $(translation).show();
        $(translation).children().show();
      });
    }

    if (elementClicked.hasClass('english-paragraph')) {
      const translation = elementClicked;
      const language = $(translation).siblings().first();


      $(translation).fadeToggle(150, () => {
        $(language).show();
      });
    }

  }

  lessThan100Width(): boolean {
    return $('body').width() <= 1000;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.evaluateShowTranslation();
  }


}
