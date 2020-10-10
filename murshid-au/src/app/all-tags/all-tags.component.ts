import {ChangeDetectorRef, Component,  OnInit} from '@angular/core';
import {Tag} from '../models/Tag';
import {TagsService} from '../services/tags.service';
import {Meta, Title} from '@angular/platform-browser';
import {GlobalsService} from '../services/globals.service';
import {Section} from '../models/Section';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-all-tags',
  templateUrl: './all-tags.component.html',
  styleUrls: ['./all-tags.component.scss']
})
export class AllTagsComponent implements OnInit {

  public tags$ = new Observable<Tag[]>();

  constructor(private globals: GlobalsService, private tagsService: TagsService, private meta: Meta, private title: Title) {
    const attributeSelector  = 'name="description"';
    this.meta.removeTag(attributeSelector);
    this.title.setTitle('Tags');
    this.meta.updateTag({ name: 'description', content: 'Tags are relevant words of phrases in order to locate Hindustani songs, such as singer, movie it belongs to, actors, lyricist, composer, et cetera.'});
  }

  ngOnInit(): void {
    this.globals.section = Section.AllTags;
    this.tags$ = this.tagsService.retrieveAll();
    // if (this.tags.length === 0) {
    //   setTimeout(() => {
    //     this.tags = this.tagsService.retrieveAll();
    //   }, 2000);
    // }

  }
}
