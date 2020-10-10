import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {Tag} from '../models/Tag';


@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss']
})
export class TagsListComponent  {

  @Input()
  tags: Tag[] = [];


  constructor(private renderer: Renderer2) { }


  changeTagItemStyle(evt: Event): void {
    if (evt.type === 'mouseover') {
      this.renderer.addClass(evt.target, 'tag-item-hover');
    } else {
      this.renderer.removeClass(evt.target, 'tag-item-hover');
    }
  }


}
