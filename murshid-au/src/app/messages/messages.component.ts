import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MessagesService} from '../services/messages.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  showMessages = false;

  errors$: Observable<string[]> = new Observable<string[]>();


  constructor(public messagesService: MessagesService) {

  }

  ngOnInit(): void {
    this.errors$ = this.messagesService.errors$
      .pipe(
        tap(() => this.showMessages = true)
      );

  }


  onClose(): void {
    this.showMessages = false;

  }

}
